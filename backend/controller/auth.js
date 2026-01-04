const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already Exists"
            });
        }

        let hashedPassword;

        try{
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "Error in Hashing password"
            });
        }

        const user = await User.create(
            {
                name,
                email,
                password: hashedPassword,
                role
            }
        )

        console.log(user);

        return res.status(200).json({
            success: true,
            message: "user created successfully"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "server Issue"
        });
    }
}


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter all details!"
            });
        }

        let user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered"
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };

        if(await bcrypt.compare(password, user.password)){

            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"});
            const userObject = user.toObject();
            userObject.token = token;
            userObject.password = undefined;

            const options = {
                expires: new Date( Date.now() + 30000),
                httpOnly: true
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                userObject,
                message: "User logged in successfully"
            });

            // res.status(200).json({
            //     success: true,
            //     token,
            //     userObject,
            //     message: "User logged in successfully"
            // });

        }
        else{
            return res.status(403).json({
                success: false,
                message: "Password Incorrect"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure"
        });
    }
}

