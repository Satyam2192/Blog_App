const bcrypt = require("bcrypt");
const User = require('../models/user');
const jwt = require("jsonwebtoken")
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


            const varifiedUser = user.toObject();
            varifiedUser.token = token;
            varifiedUser.password = undefined;
           
            //cresting cookie ->add cookie name
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                varifiedUser,
                message:"user logged in successfully",
            });
        }
        else{
            //password is not matched
            return res.status(403).json({
                success:false,
                message:"Invalid credentials"
            })
        }
    }
    catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Failed to login"
            })
    }
}