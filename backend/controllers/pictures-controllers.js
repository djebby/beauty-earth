const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error.js");
const Pictures = require("../models/pictures-model.js");
const User = require("../models/user-model.js");

// POST => /api/places
const createPictures = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, please check your data.",
        404
      )
    );
  }
  const { title, description, address } = req.body;

  let newPic = undefined;
  let user = undefined;
  try {
    user = await User.findById("62385d55706ae98bebc2fb5a"); // the user id should come from the chech-auth middleware
    if (!user) {
      return next(new HttpError("sorry there is no user with this id ", 404));
    }
    newPic = new Pictures({
      title,
      description,
      image_url: req.file.path,
      address,
      creator_id: "62385d55706ae98bebc2fb5a",
    });
    await newPic.save();
    user.pictures_ids.push(newPic);
    await user.save();
  } catch (error) {
    return next(
      new HttpError(
        "Creating place failed, please try again " + error.message,
        500
      )
    );
  }
  res.status(201).json({ newPic });
};

module.exports = { createPictures };
