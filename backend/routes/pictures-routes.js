const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const picturesControllers = require("../controllers/pictures-controllers.js");
const fileUpload = require("../middleware/file-upload.js");
const checkAuth = require("../middleware/check-auth.js");

//------------------------------------------------------------------------------GET => /api/places
router.get("/", picturesControllers.getPictures);
//------------------------------------------------------------------------------GET => /api/places/:picId
router.get("/:picId", picturesControllers.getPicture);
//------------------------------------------------------------------------------authentication-check
router.use(checkAuth);
//------------------------------------------------------------------------------POST => /api/places
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").isLength({ min: 3 }),
    check("description").isLength({ min: 10 }),
  ],
  picturesControllers.createPicture
);
//------------------------------------------------------------------------------PATCH => /api/places/:picId
router.patch(
  "/:picId",
  [
    check("title").isLength({ min: 3 }),
    check("description").isLength({ min: 10 }),
  ],
  picturesControllers.updatePicture
);

//------------------------------------------------------------------------------DELETE => /api/places/:picId
router.delete("/:picId", picturesControllers.deletePicture);

module.exports = router;