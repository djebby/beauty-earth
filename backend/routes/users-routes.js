const express = require("express");
const router = express.Router();
const { check } = require("express-validator"); //npm i express-validator

const userControllers = require("../controllers/users-controllers.js");
const fileUpload = require("../middleware/file-upload.js");

//------------------------------------------------------------------------------GET /api/users/:userId
router.get("/:userId", userControllers.getUserPictures);
//------------------------------------------------------------------------------POST /api/users/signup
router.post(
  "/signup",
  fileUpload.single("image"),
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  userControllers.signup
);
//------------------------------------------------------------------------------POST /api/users/login
router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  userControllers.login
);

module.exports = router;