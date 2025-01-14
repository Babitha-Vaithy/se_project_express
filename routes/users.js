const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  patchCurrentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", patchCurrentUser);

module.exports = router;
