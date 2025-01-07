const express = require("express");
const ClothingItem = require("../models/clothingItem");
const statusCode = require("../utils/error");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(400).send({ message: "Invalid Request" });
      } else {
        res.status(500).send({ message: "error from Createitem", e });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
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
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
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
};

module.exports = { createItem, getItems, deleteItem };
