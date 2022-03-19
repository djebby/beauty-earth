const bcrypt = require("bcryptjs"); // npm i bcryptjs
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const { validationResult } = require("express-validator"); // npm i express-validator

const HttpError = require("../models/http-error.js");
const User = require("../models/user-model.js");

// POST /api/users/signup
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
  console.log("users-controllers => signup");
  const { name, email, password } = req.body;

  //password encryption...
  let cryptedPassword = undefined;
  try {
    cryptedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError(error.message, 500));
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
    return next(new HttpError(error.message, 404));
  }

  //token generation...
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
    email,
    token,
  });
};

module.exports = { signup };
