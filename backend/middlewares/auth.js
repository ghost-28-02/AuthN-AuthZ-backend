const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.auth = (req, res, next) => {
    try {

        console.log("cookies->", req.cookies.token);
        // console.log("body->", req.body.token);

        const token = req.body?.token || req.cookies?.token || (req.header("Authorization") && req.header("Authorization").replace("Bearer ",""));
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "token missing"
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;

        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "token is invalid"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Issue in auth middleware",
            error : error.message
        });
    }
}

exports.isStudent = (req, res, next) => {
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for students"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching"
        })
    }
}


exports.isAdmin = (req, res, next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is protected route for admins"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching"
        })
    }
}