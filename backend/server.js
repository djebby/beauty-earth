const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const usersRoutes = require("./routes/users-routes.js");
const usersPictures = require("./routes/pictures-routes.js");

app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images"))); //serve the image statically
app.use(express.static(path.join("public"))); // serve the frontend assets statically
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.use("/api/users", usersRoutes);
app.use("/api/pictures", usersPictures);
/*
always for any unknown request we will send back our index.html file
(the REACT frontend application enter point) so the react-router can
resorve the unknown url
*/
app.use((req, res, next)=>{
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Error Handling Middelware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error)=>{
      console.log(error);
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "unknown error occurred!" });
});

mongoose
  .connect(process.env.CLOUD_MONGO_URI)
  .then(() => {
    console.log("Connection to DB Server Successfully ;)");
    app.listen(process.env.PORT || 4000);
  })
  .catch((error) => {
    console.log(error.message);
  });
