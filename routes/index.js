const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const createUserValidator = require("../middlewares/validation");
const createloginValidator = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signin", createloginValidator, login);
router.post("/signup", createUserValidator, createUser);

module.exports = router;
