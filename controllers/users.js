const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../error/BadRequestError");
const ConflictError = require("../error/ConflictError");
const NotFoundError = require("../error/NotFoundError");
const UnauthorizedError = require("../error/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
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
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
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

const getCurrentUser = (req, res, next) => {
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

const patchCurrentUser = (req, res, next) => {
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
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!password || !email) {
    next(new BadRequestError("Valid credentials required"));
  }

  User.findUserByCredentials(email, password)
    .then((data) => {
      if (data) {
        const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({ token });
      } else {
        next(new UnauthorizedError("Unauthorized error"));
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
