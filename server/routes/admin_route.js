const express = require('express');
const admin_route = express();
const adminController = require('../controller/adminController')
const customerController = require('../controller/customerController')
const auth = require('../../middlewares/admin/adminLogged')

const { adminLoggedOut,isAdminLogged } = auth;

admin_route.get('/admin',adminLoggedOut,adminController.admin_dashboard);

admin_route.get('/admin_login',isAdminLogged,adminController.get_adminLogin)
admin_route.post('/admin_login',adminController.adminLogin)
admin_route.post('/admin_logout',adminController.adminLogout)

admin_route.get('/orders',adminController.get_orders);


admin_route.get('/products',adminController.get_products);

admin_route.get('/categories',adminController.get_categories);

admin_route.get('/sub_categories',adminController.get_subCategories);

admin_route.get('/customers',customerController.get_customers);
admin_route.get('/customer_status/:id',customerController.update_status)

module.exports = admin_route;