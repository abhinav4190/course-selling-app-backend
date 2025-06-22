const { Router } = require("express");

const courseRouter = Router();

courseRouter.post("/purchase", (req, res) => {
  res.json({
    message: "Course Purchase Endpoint",
  });
});

courseRouter.get("/all", (req, res) => {
  res.json({
    message: "All Course Endpoint",
  });
});

courseRouter.get("/my", (req, res) => {
  res.json({
    message: "My Course Endpoint",
  });
});

module.exports = {
  courseRouter: courseRouter,
};
