const { validationResult } = require("express-validator");

const cloudinary = require("../middleware/cloudinary");
const HttpError = require("../models/http-error");
const Pictures = require("../models/pictures-model");
const User = require("../models/user-model");

//-----------------------------------------------------------------------------------------------------------------------------GET => /api/pictures/?picBucketNum=xx
const getPictures = async (req, res, next) => {
  const PICTURE_BUCKET_SIZE = 10; // 10 pictures per bucket
  let picNumber = +req.query.picBucketNum;
  let pictures = undefined;
  let picturesCount = undefined;
  try {
    picturesCount = await Pictures.find().count();
    pictures = await Pictures.find()
      .limit(picNumber * PICTURE_BUCKET_SIZE)
      .populate({
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

  res.json({ pictures, picturesCount });
};
//-----------------------------------------------------------------------------------------------------------------------------GET => /api/pictures/:picId
const getPicture = async (req, res, next) => {
  const pictureId = req.params.picId;
  let picture = undefined;
  try {
    picture = await Pictures.findById(pictureId);
  } catch (error) {
    return next(
      new HttpError(
        "Could not fetching the data, The Database Server has some issus.",
        500
      )
    );
  }

  if (!picture) {
    return next(
      new HttpError(
        `Could not find a picture with the provided id : ${pictureId}`,
        404
      )
    );
  }

  res.status(200).json({ picture });
};

//-----------------------------------------------------------------------------------------------------------------------------POST => /api/pictures
const createPicture = async (req, res, next) => {
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
    user = await User.findById(req.userData.userId); // req.userData.userId comming from the check-auth middleware
    if (!user) {
      return next(new HttpError("sorry there is no user with this id ", 404));
    }
    // upload the image to cloudinary server
    const imageUploadResponse = await cloudinary.uploader.upload(req.file.path);
    newPic = new Pictures({
      title,
      description,
      image_url: imageUploadResponse.secure_url,
      cloudinary_id: imageUploadResponse.public_id,
      address,
      creator_id: req.userData.userId,
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
//-----------------------------------------------------------------------------------------------------------------------------PATCH => /api/pictures/:picId
const updatePicture = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid passed inputs, please check your data.", 400)
    );
  }
  const pictureId = req.params.picId;
  let picture = undefined;
  //looking for the picture in the database
  try {
    picture = await Pictures.findById(pictureId);
  } catch (error) {
    return next(
      new HttpError(`Database Server Error We Are Sory ! Please Try Again`, 500)
    );
  }
  //send an error if we don't find any pic with the given id
  if (!picture) {
    return next(
      new HttpError(
        `Could not find a picture to update with the provided id: ${pictureId}`,
        404
      )
    );
  }
  //check if the user is authorized to update the picture...
  if (picture.creator_id.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not authorized to edit this picture", 401)
    );
  }

  const {
    title: newTitle,
    description: newDescription,
    address: newAddress,
  } = req.body;
  picture.title = newTitle;
  picture.description = newDescription;
  picture.address = newAddress;
  let newPicture = undefined;
  try {
    newPicture = await picture.save();
    res.status(201).json({ userData: req.userData, newPicture });
  } catch (error) {
    return next(
      new HttpError("Database Server Error We Are Sory ! Please Try Again", 500)
    );
  }
};
//-----------------------------------------------------------------------------------------------------------------------------DELETE => /api/pictures/:picId
const deletePicture = async (req, res, next) => {
  const pictureId = req.params.picId;
  //first let's try to find the picture
  let picture = undefined;
  try {
    picture = await Pictures.findById(pictureId).populate({
      path: "creator_id",
    });
  } catch (error) {
    return next(
      new HttpError(`Database Server Error We Are Sory ! Please Try Again`, 500)
    );
  }
  //send an error if we don't find any pic with the given id
  if (!picture) {
    return next(
      new HttpError(
        `Could not find a picture to delete with the provided id: ${pictureId}`,
        404
      )
    );
  }
  //check if the user is authorized to delete the picture...
  if (picture.creator_id._id.toString() !== req.userData.userId) {
    return next(
      new HttpError(" You are not authorized to delete this picture ", 401)
    );
  }

  //finally let's try to delete the picture
  try {
    //delete the image from the database
    picture.creator_id.pictures_ids.pull(picture);
    await picture.creator_id.save();
    await picture.remove();
    //delete the image in cloudinary
    await cloudinary.uploader.destroy(picture.cloudinary_id);
    res
      .status(200)
      .json({ message: `picture ${picture.title} deleted successfully` });
  } catch (error) {
    return next(
      new HttpError(
        `Database Server Error We Are Sory ! Please Try Again... ${error.message}`,
        500
      )
    );
  }
};

module.exports = {
  getPictures,
  getPicture,
  createPicture,
  updatePicture,
  deletePicture,
};
