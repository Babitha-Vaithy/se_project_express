const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const statusCode = require("../utils/error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(statusCode.UnauthorizedError.code)
      .send({ message: statusCode.UnauthorizedError.message });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(statusCode.UnauthorizedError.code)
      .send({ message: statusCode.UnauthorizedError.message });
  }

  req.user = payload;
  next();
  return null;
};

module.exports = auth;
