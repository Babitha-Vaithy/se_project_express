const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const statusCode = require("../utils/error");
const JWT_SECRET = require("../utils/config");

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
        return res
          .status(statusCode.CastError.code)
          .send({ message: statusCode.CastError.message });
      }
      if (err.code === 11000) {
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
  User.findOne({ email }, (err, user) => {
    if (!user) {
      return res
        .status(statusCode.CastError.code)
        .send({ message: "User not found" });
    }

    return User.findUserByCredentials(email, password)
      .then((data) => {
        const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({ token });
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          return res
            .status(statusCode.CastError.code)
            .send({ message: statusCode.CastError.message });
        }
        if (error.message === "Incorrect email or password") {
          return res
            .status(statusCode.CastError.code)
            .send({ message: statusCode.CastError.message });
        }
        return res
          .status(statusCode.serverError.code)
          .send({ message: err.message });
      });
  });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  patchCurrentUser,
};
