const express = require("express");
const router =  express.Router();


const {login, signup}= require('../Controllers/Auth');
const {auth, isuser, isAdmin} = require("../middlewares/auth");

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
router.get("/user", auth, isuser, (req,res)=>{
    res.json({
        success:true,
        message:"welcome to the Protected for user",
    });
})

router.get("/admin", auth, isAdmin, (req,res)=>{
    res.json({
        success:true,
        message:"welcome to the Protected for Admin",
    });
})

module.exports = router;