const ClothingItem = require("../models/clothingItem");
const errorcode = require("../errorcode");
const NotFoundError = require("../error/NotFoundError");
const ForbiddenError = require("../error/ForbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((e) => {
      errorcode(e, next);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      errorcode(e, next);
    });
};

const deleteItem = (req, res, next) => {
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
              errorcode(e, next);
            });
        } else {
          next(new ForbiddenError(" Forbidden Error"));
        }
      } else {
        next(new NotFoundError("Not Found Error"));
      }
    })
    .catch((err) => {
      errorcode(err, next);
    });
};

const likeItem = (req, res, next) => {
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
      errorcode(e, next);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      errorcode(e, next);
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
