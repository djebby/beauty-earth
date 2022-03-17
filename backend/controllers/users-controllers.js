const User = require("../models/user-model.js");

// POST /api/users/signup
const signup = async (req, res, next) => {
  console.log("signup run...");
  const { name, email, password, image_url } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    image_url,
    pictures_ids: [],
  });

  try {
    await newUser.save();
    res.status(201).json({
      message: "POST => http//localhost:4000/api/users/signup",
      userId: newUser.id,
      name,
      email,
      password,
    });
  } catch (error) {
    res.status(404).json({ message: "error" });
  }
};

module.exports = { signup };
