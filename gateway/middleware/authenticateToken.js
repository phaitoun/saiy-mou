const jwt = require('jsonwebtoken');
const prisma = require("../utils/prisma.js");

require('dotenv').config();


const authenticateToken = async (req ,res, next) => {

    try{

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
    
        if(!token){
            return res.status(401).json({ message: "Token is missing" });
        }
    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET )
        
        req.token = token
 
        next();
        
    }catch(err){
        console.log(err);
        return res.sendStatus(403)
    }



};


module.exports ={
    authenticateToken
}