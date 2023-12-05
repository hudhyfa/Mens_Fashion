const express = require('express');
const user_route = express();
const userController = require('../controller/userController')
const auth = require('../../middlewares/user/userLogged')


const { userLoggedIn } = auth;

user_route.get('/',userController.get_homepage)

user_route.get('/userProf', userLoggedIn, userController.get_userLogin)

user_route.get('/email_validation',userController.get_userSignup)
user_route.post('/email_validation',userController.emailValidation)

module.exports = user_route;
