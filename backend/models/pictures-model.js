const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    image_url:{ type: String, required: true},
    address: { type: String, required: true },
    creator_id: { type: mongoose.Types.ObjectId, required: true, ref: "users"}
});

module.exports = mongoose.model("pictures", pictureSchema);