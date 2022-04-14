const multer = require("multer"); //npm i multer
const { v4: uuidv4 } = require("uuid"); // npm i uuid

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}

const fileUpload = multer({
    limits: 500000,
    // in this cloudinary branch we will storage the file in the cloud.
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb)=>{
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid mime type!");
        cb(error, isValid);
    }
});

module.exports = fileUpload;