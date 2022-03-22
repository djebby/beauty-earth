const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error.js");
const Pictures = require("../models/pictures-model.js");
const User = require("../models/user-model.js");

// GET => /api/places
const getPictures = async (req, res, next) => {
  let pictures = undefined;
  try {
    pictures = await Pictures.find().populate({
      path: "creator_id",
      select: "name image_url",
    });
  } catch (error) {
    return next(
      new HttpError(
        "Could not fetching the data, The Database Server has some issus.",
        500
      )
    );
  }

  res.json({ pictures });
};

// POST => /api/places
const createPictures = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 404)
    );
  }
  const { title, description, address } = req.body;

  let newPic = undefined;
  let user = undefined;
  try {
    user = await User.findById("6239eab66c1eddaed2f4fcee"); // the user id should come from the chech-auth middleware
    if (!user) {
      return next(new HttpError("sorry there is no user with this id ", 404));
    }
    newPic = new Pictures({
      title,
      description,
      image_url: req.file.path,
      address,
      creator_id: "6239eab66c1eddaed2f4fcee",
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

module.exports = { createPictures, getPictures };
