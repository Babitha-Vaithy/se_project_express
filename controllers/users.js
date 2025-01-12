const User = require("../models/user");
const statusCode = require("../utils/error");
const bcrypt = require("bcryptjs");
const JWT_SECRET = require("../utils/config");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(statusCode.serverError.code)
        .send({ message: statusCode.serverError.message })
    );
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      console.log(user);
      delete user.password;
      console.log(user);
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(statusCode.CastError.code)
          .send({ message: statusCode.CastError.message });
      } else if (err.code === 11000) {
        console.log(err.name);
        return res
          .status(statusCode.DuplicateKeyError.code)
          .send({ message: statusCode.DuplicateKeyError.message });
      }

      return res
        .status(statusCode.serverError.code)
        .send({ message: statusCode.serverError.message });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(statusCode.DocumentNotFoundError.code)
          .send({ message: statusCode.DocumentNotFoundError.message });
      }
      if (err.name === "CastError") {
        return res
          .status(statusCode.CastError.code)
          .send({ message: statusCode.CastError.message });
      }
      return res
        .status(statusCode.serverError.code)
        .send({ message: statusCode.serverError.message });
    });
};

const patchCurrentUser = (req, res) => {
  const { name, avatar } = req.user;

  User.findOne(
    { name },
    { $addToSet: { name, avatar } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res
          .status(statusCode.CastError.code)
          .send({ message: statusCode.CastError.message });
      } else {
        res
          .status(statusCode.serverError.code)
          .send({ message: statusCode.serverError.message });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  patchCurrentUser,
};
