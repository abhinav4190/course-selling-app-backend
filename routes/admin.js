const { Router } = require("express");

const adminRouter = Router();

adminRouter.post("/signin", (req, res) => {
  res.json({
    message: "Admin SignIn Endpoint",
  });
});

adminRouter.post("/signup", (req, res) => {
  res.json({
    message: "Admin SignUp Endpoint",
  });
});

adminRouter.post("/create-course", (req, res) => {
  res.json({
    message: "Create Course Endpoint",
  });
});
adminRouter.delete("/delete-course", (req, res) => {
  res.json({
    message: "Delete Course Endpoint",
  });
});
adminRouter.put("/add-course-content", (req, res) => {
  res.json({
    message: "Add Course Content Endpoint",
  });
});
module.exports = {
  adminRouter: adminRouter,
};
