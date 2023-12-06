const express = require('express');
const user_route = express();
const userController = require('../controller/userController')
const auth = require('../../middlewares/user/userLogged')


const { userLoggedIn } = auth;

user_route.get('/',userController.get_homepage)

user_route.get('/user_login', userLoggedIn, userController.get_userLogin)

user_route.get('/email_validation',userController.get_emailValidation)
user_route.post('/email_validation',userController.emailValidation)

user_route.get('/otp_verification',userController.get_verifyOtp)
user_route.post('/otp_verification',userController.otpValidation)
user_route.post('/otp_resent',userController.resendOtp)

user_route.get('/user_signup',userController.get_userSignup)
user_route.post('/user_signup',userController.userSignup)

module.exports = user_route;
