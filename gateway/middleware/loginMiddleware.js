const prisma = require("../utils/prisma.js");



const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    let authToken = '';
    try {
        
        if (authHeader) {
          authToken = authHeader.split(' ')[1];
        }
      
        if (!authToken) {
          return res.status(403).send({ message: 'No token provided.' });
        }
    
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ error: 'Unauthorized' });
    }
  };
const existingUser = async (req,res,next) =>{
        
    const {email} = req.body
    
    try{

        const findUser = await prisma.users.findFirst({
            where: {
                email: email 
            }
        });
        
        if(findUser){
            return res.status(400).json({message :"This email is registered"})
        }
        next();
    }
    catch (error){
        return res.status(500).json({ error: 'server error' });
    }
};

module.exports = {
    existingUser,
    verifyToken,
}