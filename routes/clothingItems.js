const { createItem } = require("../controllers/clothingItems");

const router = require("express").Router();

router.get("/", () => console.log("Get"));
router.post("/", createItem);
router.delete("/:itemId", () => console.log("delete"));

module.exports = router;
