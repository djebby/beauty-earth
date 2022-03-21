const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, minlength: 6},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image_url: { type: String, required: true },
  pictures_ids: [
    { type: mongoose.Types.ObjectId, required: true, ref: "pictures" },
  ],
});

module.exports = mongoose.model("users", userSchema);
