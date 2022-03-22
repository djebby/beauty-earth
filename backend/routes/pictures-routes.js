const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const picturesControllers = require("../controllers/pictures-controllers.js");
const fileUpload = require("../middleware/file-upload.js");

router.get("/", picturesControllers.getPictures);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").isLength({ min: 3 }),
    check("description").isLength({ min: 10 }),
  ],
  picturesControllers.createPictures
);

module.exports = router;
