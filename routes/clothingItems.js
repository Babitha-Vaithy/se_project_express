const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createItemsValidator } = require("../middlewares/validation");
const { validateId } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", auth, createItemsValidator, createItem);

router.delete("/:itemId", validateId, auth, deleteItem);
router.put("/:itemId/likes", validateId, auth, likeItem);
router.delete("/:itemId/likes", validateId, auth, dislikeItem);

module.exports = router;
