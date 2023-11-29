const express = require('express');
const user_route = express();
const userController = require('../controller/userController')
const auth = require('../../middlewares/user/userLogged')


const { userLoggedIn } = auth;

user_route.get('/userProf', userLoggedIn, userController.get_userLogin)

user_route.get('/userSignIn',userController.get_userSignup)
user_route.post('/userSignIn',userController.emailValidation)

module.exports = user_route;
