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
router.get("/me", getCurrentUser);
router.patch("/me", patchCurrentUser);
//router.post("/", createUser);

module.exports = router;
