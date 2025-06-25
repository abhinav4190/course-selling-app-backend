const express = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const userMiddleware = require("../middlewares/user");

const { userModel, courseModel, purchaseModel } = require("../db");
const course = require("./course");
const { default: mongoose } = require("mongoose");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const userScheme = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  });

  const parseResult = userScheme.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid Input",
      details: parseResult.error.flatten(),
    });
  }

  const { email, password, firstName, lastName } = parseResult.data;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const parseResult = userSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid Input",
      details: parseResult.error.flatten(),
    });
  }
  const { email, password } = parseResult.data;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Incorrect Password" });
    const token = jwt.sign({ id: user._id }, process.env.USER_JWT_SECRET);
    res.json({
      message: "User Signin successful",
      token: token,
    });
  } catch (err) {
    console.error("Signin  error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/my", userMiddleware, async (req, res) => {
  res.json({
    userid: req.userID,
  });
});

userRouter.get("/all-courses", async (req, res) => {
  try {
    const allCourses = await courseModel.find();
    res.json({
      message: "Course fetched successful",
      token: allCourses,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.get("/purchased-course", userMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const purchasedCourses = await purchaseModel.find({ userId });

    const courseIds = purchasedCourses.map(course => course.courseId);

    const courses = await courseModel.find({ _id: { $in: courseIds } });

    res.json({
      message: "Purchased courses fetched successfully",
      courses,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

userRouter.post("/purchase-course", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const purchaseSchema = z.object({
    courseId: z.string(),
  });
  const parseResult = purchaseSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(401).json({
      message: "Invalid Input",
      error: parseResult.error.flatten(),
    });
  }
  const { courseId } = parseResult.data;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ error: "Invalid course ID" });
  }

  try {
    const existingPurchase = await purchaseModel.findOne({ courseId, userId });
    if (!existingPurchase) {
      const purchasedCourse = await purchaseModel.create({
        courseId,
        userId,
      });
      res.json({
        message: "Course purchased successfully",
        purchasedCourse: purchasedCourse,
      });
    } else {
      res.json({
        message: "Course is alreday purchased",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

module.exports = {
  userRouter: userRouter,
};
