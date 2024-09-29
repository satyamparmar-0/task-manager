const jwt = require('jsonwebtoken');
const User = require('../models/user.auth');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = { _id: decoded.userId };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "You need to log in to access this resource." });
  };

function SetUser(user) {
    return jwt.sign(
        {
            _id: user.id,
            username: user.username
        },
        process.env.SECRET_KEY,
        { expiresIn: '1y' }
    );
}

// Function to decode a JWT token
function GetUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.error(`Error while decoding token: ${error}`);
        return null;
    }
}

async function restrictToUserLoginOnly(req,res,next){
    const UserId = req.cookies.uid;
    if(!UserId) return res.redirect('/login');
    const user = GetUser(UserId)

    if(!user) return res.redirect('/login');

    req.user = user;
    next();

}

module.exports = {authenticateUser,SetUser,GetUser,restrictToUserLoginOnly,isAuthenticated};