const express = require('express');
const admin_route = express();
const multer = require('multer');
const upload = multer({dest:'uploads/'})
const adminController = require('../controller/adminController')
const customerController = require('../controller/customerController')
const productController = require('../controller/productController');
const categoryController = require('../controller/categoryController');
const orderController = require('../controller/orderController');
const auth = require('../../middlewares/admin/adminLogged')

const { adminLoggedOut,isAdminLogged } = auth;

admin_route.get('/admin',adminLoggedOut,adminController.admin_dashboard);

admin_route.get('/admin_login',isAdminLogged,adminController.get_adminLogin)
admin_route.post('/admin_login',adminController.adminLogin)
admin_route.post('/admin_logout',adminController.adminLogout)

admin_route.get('/orders',orderController.get_orders);
admin_route.post('/orders',orderController.get_orders);
admin_route.get('/update-status/:id/:status',orderController.update_status);
admin_route.post('/admin-search-order',orderController.search_order);
admin_route.post('/single-order',orderController.get_single_order);

admin_route.get('/products',productController.get_products);
admin_route.post('/products',productController.get_products);
admin_route.get('/add_product',productController.get_add_product)
admin_route.post('/add_product',upload.array('images'),productController.add_product);
admin_route.get('/update_status/:id',productController.update_status)
admin_route.get('/edit-product/:id',productController.get_edit_product);
admin_route.post('/edit-product/:id',upload.array('newImages'),productController.edit_product)
admin_route.get('/delete-image',productController.delete_image);
admin_route.post('/admin-search-product',productController.search_product);

admin_route.get('/categories',categoryController.get_categories);
admin_route.get('/add_category',categoryController.get_add_category);
admin_route.post('/add_category',categoryController.add_category);
admin_route.get('/update_category_status/:id',categoryController.update_category_status);
admin_route.get('/edit_category/:id',categoryController.get_edit_category)
admin_route.post('/edit_category/:id',categoryController.update_category);

admin_route.get('/sub_categories',categoryController.get_subCategories);

admin_route.get('/customers',customerController.get_customers);
admin_route.get('/customer_status/:id',customerController.update_status)

module.exports = admin_route;