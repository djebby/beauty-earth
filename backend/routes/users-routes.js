const express = require("express");
const router = express.Router();
const { check } = require("express-validator"); //npm i express-validator

const userControllers = require("../controllers/users-controllers.js");
const fileUpload = require("../middleware/file-upload.js");

// GET /api/users/
router.get("/", (req, res, next) => {
  res.send("GET => http://localhost:4000/api/users/");
});

// POST /api/users/signup
router.post(
  "/signup",
  fileUpload.single("image"),
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  userControllers.signup
);

module.exports = router;
