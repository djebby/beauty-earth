const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    image_url:{ type: String, required: true},
    cloudinary_id:{ type: String, required: true},
    address: { type: String, required: true },
    creator_id: { type: mongoose.Types.ObjectId, required: true, ref: "User"}
});

module.exports = mongoose.model("Picture", pictureSchema);