const ClothingItem = require("../models/clothingItem");
const statusCode = require("../utils/error");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
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

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      if (e.name in statusCode) {
        return res
          .status(statusCode[e.name].code)
          .send({ message: statusCode[e.name].message });
      }
      return res
        .status(statusCode.serverError.code)
        .send({ message: statusCode.serverError.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (item) {
        const userId = req.user._id;
        if (userId === item.owner.toString()) {
          ClothingItem.findByIdAndDelete(itemId)
            .orFail()
            .then((data) => res.status(200).send(data))
            .catch((e) => {
              if (e.name in statusCode) {
                res
                  .status(statusCode[e.name].code)
                  .send({ message: statusCode[e.name].message });
              } else {
                res
                  .status(statusCode.serverError.code)
                  .send({ message: statusCode.serverError.message });
              }
            });
        } else {
          res
            .status(statusCode.ForbiddenError.code)
            .send({ message: statusCode.ForbiddenError.message });
        }
      } else {
        res
          .status(statusCode.DocumentNotFoundError.code)
          .send({ message: statusCode.DocumentNotFoundError.message });
      }
    })
    .catch((err) => {
      if (err.name in statusCode) {
        res
          .status(statusCode[err.name].code)
          .send({ message: statusCode[err.name].message });
      } else {
        res
          .status(statusCode.serverError.code)
          .send({ message: statusCode.serverError.message });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((e) => {
      if (e.name in statusCode) {
        return res
          .status(statusCode[e.name].code)
          .send({ message: statusCode[e.name].message });
      }
      return res
        .status(statusCode.serverError.code)
        .send({ message: statusCode.serverError.message });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      if (e.name in statusCode) {
        return res
          .status(statusCode[e.name].code)
          .send({ message: statusCode[e.name].message });
      }
      return res
        .status(statusCode.serverError.code)
        .send({ message: statusCode.serverError.message });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
