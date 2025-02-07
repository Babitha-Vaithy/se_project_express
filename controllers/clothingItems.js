const ClothingItem = require("../models/clothingItem");
const statusCode = require("../utils/error");
const errorcode = require("../errorcode");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((e) => {
      errorcode(e);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      errorcode(e);
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
              errorcode(e);
            });
        } else {
          next(new ForbiddenError(" Forbidden Error"));
        }
      } else {
        next(new NotFoundError("Not Found Error"));
      }
    })
    .catch((err) => {
      errorcode(err);
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
      errorcode(e);
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
      errorcode(e);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
