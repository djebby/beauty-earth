const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users-controllers.js");

// GET /api/users/
router.get("/", (req, res, next)=>{
    res.send("GET => http://localhost:4000/api/users/");
});

// POST /api/users/signup
router.post("/signup", userControllers.signup);



module.exports = router;