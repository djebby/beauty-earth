const User = require("../models/user-model.js");

// POST /api/users/signup
const signup = async (req, res, next) => {
  console.log("signup run... ",req.body);
  
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
      message: "user added successfully",
      userId: newUser.id,
      name,
      email
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = { signup };
