const jwt = require("jsonwebtoken");

async function userMiddleware(req, res, next) {
  const token = req.headers.token;
  if (!token) {
   return res.status(401).json({
      message: "Token not found!",
    });
  }
  try {
    const decodedData = await jwt.verify(token, process.env.USER_JWT_SECRET);
    if (decodedData) {
      req.userId = decodedData.id;
      next();
    }
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token!",
    });
  }
}

module.exports = userMiddleware;
