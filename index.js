const express = require("express");
require("dotenv").config();
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();
app.use(express.json());
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

app.listen(3000, (err, data) => {
  if (err) {
    console.log("Error listening server on PORT 3000");
  } else {
    console.log("Server started running on PORT 3000");
  }
});
