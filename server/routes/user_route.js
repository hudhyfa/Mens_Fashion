const express = require('express');
const user_route = express();
const userController = require('../controller/userController')
const shopController = require('../controller/shopController')
const profileController = require('../controller/profileController')
const cartController = require('../controller/ cartController');
const auth = require('../../middlewares/user/userLogged');


const { userLoggedIn,validUser } = auth;

user_route.get('/',userController.get_homepage)

user_route.get('/user_login', userLoggedIn, userController.get_userLogin)
user_route.post('/user_login',userController.userLogin)
user_route.post('/user_logout',userController.userLogout)

user_route.get('/email_validation',userController.get_emailValidation)
user_route.post('/email_validation',userController.emailValidation)

user_route.get('/otp_verification',userController.get_verifyOtp)
user_route.post('/otp_verification',userController.otpValidation)
user_route.post('/otp_resent',userController.resendOtp)

user_route.get('/user_signup',userController.get_userSignup)
user_route.post('/user_signup',userController.userSignup)

user_route.get('/shop-products',shopController.shop_products);
user_route.post('/shop-products',shopController.shop_products);
user_route.get('/view-product/:id',shopController.view_product);
user_route.post('/search-product',shopController.search_product);
user_route.post('/filter-category',shopController.filter_products_by_category);
user_route.post('/filter-price',shopController.filter_products_by_price);
user_route.post('/sort-products',shopController.sort_products);

user_route.post('/add-to-cart',cartController.add_to_cart);

user_route.get('/user-profile/:id', validUser, profileController.get_userProfile)

user_route.get('/wallet/:id',profileController.get_wallet);
user_route.post('/wallet-add-money/:id',profileController.add_wallet)

user_route.get('/address/:id',profileController.get_address);
user_route.get('/add-address/:id',profileController.get_add_address);
user_route.post('/add-address/:id',profileController.add_address);
user_route.get('/edit-address/:id',profileController.get_edit_address);
user_route.post('/edit-address/:id',profileController.edit_address);
user_route.post('/delete-address/:id',profileController.delete_address);

user_route.get('/security/:id',profileController.get_security);
user_route.post('/security/:id',profileController.change_password);

user_route.get('/coupon/:id',profileController.get_coupon)

module.exports = user_route;

