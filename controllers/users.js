const User = require("../models/user");
const statusCode = require("../utils/error");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(statusCode.CastError.code)
          .send({ message: statusCode.CastError.message });
      }
      return res
        .status(statusCode.serverError.code)
        .send({ message: statusCode.serverError.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
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

module.exports = { getUsers, createUser, getUser };
