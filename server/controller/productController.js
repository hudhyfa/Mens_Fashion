const Product = require('../modal/product');
const Category = require('../modal/category');

const get_products = async (req,res) => {
    try {
        res.render('admin/products')        
    } catch (error) {
        console.error("Error rendering products page")
    }
}

const get_add_product = async (req,res) => {
    try {
        const categories = await Category.find();
        res.render('admin/addProduct',{categories:categories})  
    } catch (error) {
        console.error("Error rendering addProduct page")
    }
}

const add_product = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports ={
    get_products,
    get_add_product
}