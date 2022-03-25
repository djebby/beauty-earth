const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error.js");

module.exports = (req, res, next) => {
    if(req.method === "OPTIONS"){
        return next();
    }
    try {
        let token = undefined;
        if("authorization" in req.headers){
            token = req.headers.authorization.split(" ")[1]; //Authentication: "Bearer TOKEN..."
        }
        if(!token){
            throw new Error("Authentication failed!");
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = {userId: decoded.userId, userEmail: decoded.userEmail}
        next();
    } catch (error) {
        //invalid token ==> 403 forbidden
        return next(new HttpError("Authentication failed!", 403));
    }
}