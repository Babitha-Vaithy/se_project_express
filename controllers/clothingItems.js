const express = require("express");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "error from Createitem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      console.error(err);
      return res.status(500).send({ message: "error from GetItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      return res.status(500).send({ message: "error from deleteItem", e });
    });
};

module.exports = { createItem, getItems, deleteItem };
