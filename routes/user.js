const express = require("express");

const userRouter = express.Router();

userRouter.post("/signin", (req, res) => {
  res.json({
    message: "User SignIn Endpoint",
  });
});

userRouter.post("/signup", (req, res) => {
  res.json({
    message: "User SignUp Endpoint",
  });
});

module.exports = {
  userRouter: userRouter,
};
