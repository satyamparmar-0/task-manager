const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user.auth.controllers');
const {validateLogin} = require('../validations/signup.validations');
const {validateSignup} = require('../validations/signup.validations');
const jwt = require('jsonwebtoken');
router.post('/signup',validateSignup,userController.signup);
router.post('/login',validateLogin,userController.login);

// router.get('/google/callback', passport.authenticate('google', {
//     successRedirect: process.env.CLIENT_URL,
//     failureRedirect: '/login/failed', // Fixed here
//     scope: ['profile', 'email']
// }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    const token = req.user.token;
    res.redirect(`${process.env.CLIENT_URL}/tasks?token=${token}`); // Redirect with token
});
  

router.get('/login/failed', (req, res) => { // Fixed here
    res.status(401).json({
        success: false,
        error: true,
        message: 'User failed to authenticate.'
    });
});

router.get('/login/success', (req, res) => { // Fixed here
    if (req.user) {
        res.status(200).json({
            success: true,
            message: 'User has successfully authenticated.',
            user: req.user,
            cookies: req.cookies
        });
    } else {
        res.status(401).json({
            success: false,
            error: true,
            message: 'User failed to authenticate.'
        });
    }   
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
