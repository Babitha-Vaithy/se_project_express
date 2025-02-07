const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const statusCode = require("../utils/error");
const JWT_SECRET = require("../utils/config");
const errorcode = require("../errorcode");

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  const pwd = req.body.password;

  bcrypt
    .hash(pwd, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const { password, ...response } = user.toObject();
      res.status(201).send(response);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid format"));
      }
      if (err.code === 11000) {
        next(new ConflictError("Duplicate Key Error"));
      }

      next(err);
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not Found Error"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid format"));
      }
      next(err);
    });
};

const patchCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findOneAndUpdate(
    { _id },
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("DocumentNotFoundError"))
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Not Found Error"));
      }
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid format"));
      } else {
        next(err);
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res
      .status(statusCode.CastError.code)
      .send({ message: "Valid Credential is required" });
    return;
  }

  User.findUserByCredentials(email, password)
    .then((data) => {
      if (data) {
        const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({ token });
      } else {
        res
          .status(statusCode.UnauthorizedError.code)
          .send({ message: statusCode.UnauthorizedError.message });
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Invalid format"));
      }
      if (error.message === "Incorrect email or password") {
        next(new UnauthorizedError(" Unauthorized Error"));
      }
      next(error);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  patchCurrentUser,
};
