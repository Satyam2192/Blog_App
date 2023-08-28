const express = require("express");
const router =  express.Router();


const {login, signup}= require('../Controllers/Auth');
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post('/login', login);
router.post('/signup', signup);


//testing protected route
router.get("/test", auth, (req,res)=>{
    res.json({
        success:true,
        message:"welcome to the Protected for test",
    });
})

//protected routes
router.get("/student", auth, isStudent, (req,res)=>{
    res.json({
        success:true,
        message:"welcome to the Protected for student",
    });
})

router.get("/admin", auth, isAdmin, (req,res)=>{
    res.json({
        success:true,
        message:"welcome to the Protected for Admin",
    });
})

module.exports = router;