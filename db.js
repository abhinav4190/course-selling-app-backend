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


// {
//   "message": "Course created successfully",
//   "course": {
//     "title": "Full Stack Dev",
//     "description": "The course by abhinav",
//     "price": 499,
//     "imageUrl": "https://ibb.co/5XNR0wfP",
//     "courseContent": "mongodb, express",
//     "creatorId": "685a4290edc2b3628bdd17a3",
//     "_id": "685b1535125adbb5488d27c8",
//     "__v": 0
//   }
// }