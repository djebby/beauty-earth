const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes.js");

app.use(bodyParser.json());
app.use("/api/users", usersRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connection to DB Server Successfully ;)");
    app.listen(process.env.PORT || 4000);
})
.catch((error)=>{
    console.log(error.message);
});
