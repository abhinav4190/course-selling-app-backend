const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  courseContent: String,
  creatorId: {
    type: ObjectId,
    ref: "admins",
  },
});

const purchaseSchema = new Schema({
  courseId: {
    type: ObjectId,
    ref: "courses",
  },
  userId: {
    type: ObjectId,
    ref: "users",
  },
});

const userModel = model("users", userSchema);
const adminModel = model("admins", adminSchema);
const courseModel = model("courses", courseSchema);
const purchaseModel = model("purchases", purchaseSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
};
