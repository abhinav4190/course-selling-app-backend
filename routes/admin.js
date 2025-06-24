const { Router } = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { userModel, adminModel, courseModel, purchaseModel } = require("../db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const adminMiddleware = require("../middlewares/admin");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  });
  const parseResult = userSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid Input",
      details: parseResult.error.flatten(),
    });
  }
  const { email, password, firstName, lastName } = parseResult.data;

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    const newAdmin = await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: newAdmin,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.post("/signin", async (req, res) => {
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
    const admin = await adminModel.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Admin not found" });
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.ADMIN_JWT_SECRET);

    res.json({
      message: "Admin Signin successful",
      token: token,
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

adminRouter.post("/create-course", adminMiddleware, async (req, res) => {
  const userID = req.userId;
  const courseSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    courseContent: z.string(),
  });
  const parseResult = courseSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid Input",
      details: parseResult.error.flatten(),
    });
  }
  const { title, description, price, imageUrl, courseContent } =
    parseResult.data;

  try {
    const course = await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      courseContent,
      creatorId: userID,
    });
    res.json({
      message: "Course created successfully",
      course: course,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
adminRouter.delete("/delete-course", adminMiddleware, async (req, res) => {
  const userID = req.userId;
  const courseSchema = z.object({
    courseId: z.string(),
  });
  const parseResult = courseSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid Input",
      details: parseResult.error.flatten(),
    });
  }
  const { courseId } = parseResult.data;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ error: "Invalid course ID" });
  }
  try {
    const course = await courseModel.findOne({
      _id: courseId,
      creatorId: userID,
    });
    if (!course) return res.status(401).json({ error: "Course not found" });
    await courseModel.deleteOne({
      _id: courseId,
    });
    res.json({
      message: "Course deleted successfully",
      deletedCourse: course,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
adminRouter.put("/add-course-content", adminMiddleware, async (req, res) => {
  const userId = req.userId;
  const courseSchema = z.object({
    courseId: z.string(),
    courseContent: z.string(),
  });

  const parseResult = courseSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(401).json({
      message: "Invalid Input",
      error: parseResult.error.flatten(),
    });
  }

  const { courseId,  courseContent} = parseResult.data;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      error: "Invalid Course Id",
    });
  }
  try {
    const updatedCourse = await courseModel.findOneAndUpdate(
      { _id: courseId, creatorId: userId },
      { $set: { courseContent: courseContent } },
      { new: true }
    );
    if(!updatedCourse) return res.status(401).json({
      message: "error in finding and updating course"
    })
    res.json({
      message: "Course content updated successfully",
      updatedCourse: updatedCourse,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = {
  adminRouter: adminRouter,
};
