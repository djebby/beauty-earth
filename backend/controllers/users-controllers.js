const bcrypt = require("bcryptjs"); // npm i bcryptjs
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const { validationResult } = require("express-validator"); // npm i express-validator

const HttpError = require("../models/http-error.js");
const User = require("../models/user-model.js");

//-----------------------------------------------------------------------------------------------------------------------------GET /api/users/:userId
const getUserPictures = async (req, res, next) => {
  const userId = req.params.userId;
  let userPictures = undefined;
  try {
    userPictures = await User.findById(userId, "-password").populate({
      path: "pictures_ids",
      select: "-creator_id",
    });
    if (userPictures === null) {
      throw new Error();
    }
  } catch (error) {
    if (userPictures === undefined || userPictures === null) {
      return next(
        new HttpError(`There is no user with this id ${userId}`, 404)
      );
    }
    return next(new HttpError("Error in the database server", 500));
  }

  res.status(200).json({ userPictures });
};

//-----------------------------------------------------------------------------------------------------------------------------POST /api/users/signup
const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Could not create a new user, credentials seem to be wrong.",
        404
      )
    );
  }
  const { name, email, password } = req.body;
  //check the availability of the email in the database
  let isEmailExist = undefined;
  try {
    isEmailExist = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError(
        "Could not create a new user, Database Server has some issus.",
        500
      )
    );
  }
  if (isEmailExist) {
    console.log(isEmailExist);
    return next(
      new HttpError("Could not create a new user, email already exist.", 422)
    );
  }
  //password encryption...
  let cryptedPassword = undefined;
  try {
    cryptedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError("Could not create a new user, Server has some issus.", 500)
    );
  }
  let newUser = undefined;
  try {
    newUser = new User({
      name,
      email,
      password: cryptedPassword,
      image_url: req.file.path,
      pictures_ids: [],
    });
    await newUser.save();
  } catch (error) {
    return next(
      new HttpError("Could not create a new user, invalid credentials...", 404)
    );
  }
  //token ( with 2days validation ) generation part ...
  let token = undefined;
  try {
    token = jwt.sign(
      { userId: newUser.id, userEmail: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: "48h" }
    );
  } catch (error) {
    return next(
      new HttpError(
        "Could not create a new user, Data Base Server has some issus.",
        500
      )
    );
  }
  res.status(201).json({
    message: "user added successfully",
    userId: newUser.id,
    userEmail: email,
    expirationTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 48).getTime(), // 2 days in the future 1000milliseconds * 60 = 1seconde * 60 = 1hour * 48 = 2days
    userToken: token,
  });
};

//-----------------------------------------------------------------------------------------------------------------------------POST /api/users/login
const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError(
        "Could not create a new user, credentials seem to be wrong.",
        404
      )
    );
  }
  const { email, password } = req.body;
  let existingUser = undefined;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Could not login you, the server has some issus.", 500)
    );
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "sorry there is no user with this email in our database",
        401
      )
    );
  }

  //password comparison part...
  let passwordValidity = false;
  try {
    passwordValidity = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError("Could not login you, the server has some issus.", 500)
    );
  }

  if (!passwordValidity) {
    return next(new HttpError("wrong password", 401));
  }

  //token ( with 2days validation ) generation part ...
  let token = undefined;
  try {
    token = jwt.sign(
      { userId: existingUser.id, userEmail: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "48h" }
    );
    
  } catch (error) {
    return next(
      new HttpError(
        "Could not create a new user, Data Base Server has some issus.",
        500
      )
    );
  }
  res.status(200).json({
    message: "user logedin successfully",
    userId: existingUser.id,
    userEmail: existingUser.email,
    expirationTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 48 ).getTime(), // 2 days in the future 1000milliseconds * 60 = 1seconde * 60 = 1hour * 48 = 2days
    userToken: token,
  });
};

module.exports = { getUserPictures, signup, login };
