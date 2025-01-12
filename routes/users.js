const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  patchCurrentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);
//router.get("/", getUsers);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", patchCurrentUser);
//router.post("/", createUser);

module.exports = router;
