const statusCode = require("../utils/error");

const ClothingItem = require("../models/clothingItem");

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((items) => {
      // console.log("succesS");
      res.status(200).send(items);
    })
    .catch((e) => {
      // console.error(e);
      if (e.name in statusCode) {
        return res
          .status(statusCode[e.name]["code"])
          .send({ message: statusCode[e.name]["message"] });
      }
      return res
        .status(statusCode[serverError]["code"])
        .send({ message: statusCode[serverError]["message"] });
    });

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      // console.error(e);
      if (e.name in statusCode) {
        return res
          .status(statusCode[e.name]["code"])
          .send({ message: statusCode[e.name]["message"] });
      }
      return res
        .status(statusCode[serverError]["code"])
        .send({ message: statusCode[serverError]["message"] });
    });

module.exports = { likeItem, dislikeItem };
