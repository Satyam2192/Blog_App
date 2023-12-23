
project setup:
npm i express nodemon mongoose dotenv bcrypt jsonwebtoken

/server
    /config
        database.js
    /Controlers
        Auth.js
    /middleweres
        auth.js
    /models
        user.js
    /routes
        user.js




/server/config/database.js
const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => {console.log("db connected successfully")})
    .catch((err)=>{
        console.log("err in connecting to database");
        console.log(err);
        process.exit(1);

    });
}




server/Controlers/Auth.js
const bcrypt = require("bcrypt");
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { models } = require("mongoose");
require("dotenv").config();

// signup route handler
exports.signup = async (req, res) => {
    try {
        // Get data
        const { name, email, password, role } = req.body;

        // Debug: Log input data
        console.log("Password:", password);
        console.log("Salt Rounds:", 10);

        // Check if password is available
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use',
            });
        }


        // Hash password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            console.error("Hashing error:", err);
            return res.status(500).json({
                success: false,
                message: 'Error in hashing password'
            });
        }

        // Create entry in the database for user
        const user = await User.create({
            name, email, password: hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: 'User created successfully'
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create user, please try again later"
        });
    }
};


//Login
    
exports.login = async(req,res) =>{
    try{
        //data fetch 
        const {email,password}  = req.body
        //validation on email and password 
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'please fill all the details',
            });
        }
        
        //check entry is present in database or not 
        let user = await User.findOne({ email });

        //if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }
        
        //verify password and generate a JWT Token
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });


            // user = user.toObject();`
            user.token = token;
            user.password = undefined;
           
            //cresting cookie ->add cookie name
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully",
            });
            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: "User logged in successfully",
            // });
        } else {
            // Password is not matched
            return res.status(403).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login",
        });
    }
};




server/middleweres/auth.js
// auth, isuser, is Admin

const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = (req,res,next)=>{
    try{
        //extract jwt token
        //PENDING:other ways to fetch token (total 3 ways 1->req.body.token , 2->req.cookie.token, 3->pending)
        // const token = req.body.token;
        console.log(req.cookies.token);
        console.log(req.header("Authorization".replace("Bearer", "")));
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer", "");
        console.log("token is->",token)
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing",
            })
        }

        //varify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload
        }catch(error){
            return res.status(500).json({
            success:false,
            message:"token is invalid",
        })
        }

        next();


    }catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"something went wrong",
        })
    }
}

exports.isuser = (req,res,next) =>{
    try {
        if(req.user.role !== "user"){
            return res.status(401).json({
                success:false,
                message:"only users have access"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role is not matching",
        })
    }
    
}

exports.isAdmin = (req,res,next) =>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"only Admin have access"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role is not matching",
        })
    }
    
}



server/models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Admin","user","Visitor"]
    }
})


module.exports = mongoose.model("user",userSchema);



server/routes/user.js
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