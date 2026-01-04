const express = require('express');
const router = express.Router();

const {login, signup} = require("../controller/auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/login",login);
router.post("/signup",signup);

router.get("/test",auth, (req, res) => {
    res.json({
        success: true,
        message: "this is test code"
    })
})

router.get("/student",auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Student Dashboard"
    });
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Admin Dashboard"
    });
})


module.exports = router;
