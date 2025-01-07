const router = require("express").Router();

const { likeItem, dislikeItem } = require("../controllers/like");

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
