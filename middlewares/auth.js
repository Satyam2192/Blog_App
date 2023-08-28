// auth, isStudent, is Admin

const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = (req,res,next)=>{
    try{
        //extract jwt token
        //PENDING:other ways to fetch token (total 3 ways 1->req.body.token , 2->req.cookie.token, 3->pending)
        const token = req.body.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing",
            })
        }

        //varify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
        }

    } catch(error){

    }
}