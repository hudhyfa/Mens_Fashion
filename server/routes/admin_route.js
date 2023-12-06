const express = require('express');
const admin_route = express();
const adminController = require('../controller/adminController')
const auth = require('../../middlewares/admin/adminLogged')

const { adminLoggedOut,isAdminLogged } = auth;

admin_route.get('/admin',adminLoggedOut,adminController.admin_dashboard);

admin_route.get('/admin_login',isAdminLogged,adminController.get_adminLogin)
admin_route.post('/admin_login',adminController.adminLogin)
admin_route.post('/admin_logout',adminController.adminLogout)

module.exports = admin_route;