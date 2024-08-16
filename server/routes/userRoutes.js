const express = require("express");
const {
  createUser,
  loginUser,
  refresh,
} = require("../controller/userController");
const router = express.Router();

router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/refresh").post(refresh);

module.exports = router;
