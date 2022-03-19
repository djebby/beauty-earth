const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const usersRoutes = require("./routes/users-routes.js");

app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images"))); //serve the image staticlly
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
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection to DB Server Successfully ;)");
    app.listen(process.env.PORT || 4000);
  })
  .catch((error) => {
    console.log(error.message);
  });
