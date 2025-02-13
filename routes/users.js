const router = require("express").Router();
const updateUserValidator = require("../middlewares/validation");

const { getCurrentUser, patchCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", updateUserValidator, patchCurrentUser);

module.exports = router;
