const e = require("express");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl }).then((item) => {
    res.send({ data: item }).catch((e) => {
      res.status(500).send({ message: "error from CreateItem", e });
    });
  });
};

module.exports = { createItem };
