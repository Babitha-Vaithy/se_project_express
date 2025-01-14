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
      delete user._doc.password;
      res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
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
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        console.log("404");
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
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findOneAndUpdate({ _id }, { name, avatar }, { new: true })
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
  if (!password) {
    res
      .status(statusCode.CastError.code)
      .send({ message: "Password is required" });
    return;
  }
  User.findOne({ email }, function (err, user) {
    if (!user) {
      res.status(statusCode.CastError.code).send({ message: "User not found" });
    } else {
      return User.findUserByCredentials(email, password)
        .then((user) => {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: "7d",
          });
          res.status(200).send({ token });
        })
        .catch((err) => {
          console.log(err);
          if (err.name === "ValidationError") {
            return res
              .status(statusCode.CastError.code)
              .send({ message: statusCode.CastError.message });
          } else if (err.message === "Incorrect email or password") {
            return res
              .status(statusCode.CastError.code)
              .send({ message: statusCode.CastError.message });
          } else {
            res
              .status(statusCode.serverError.code)
              .send({ message: err.message });
          }
        });
    }
  });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  patchCurrentUser,
};
