const express = require('express');
const admin_route = express();
const adminController = require('../controller/adminController')
const auth = require('../../middlewares/admin/adminLogged')

const { adminLoggedIn } = auth;

admin_route.get('/admin',adminLoggedIn,adminController.admin_dashboard);

admin_route.get('/admin_login',adminController.get_adminLogin)
admin_route.post('/admin_login',adminController.adminLogin)

module.exports = admin_route;