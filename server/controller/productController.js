const Product = require('../modal/product');
const Category = require('../modal/category');
const validator = require('../../utils/admin_validator')

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
        const { name,category,price,offerPrice,q_small,q_medium,q_large,description } = req.body;

        const validate_product = validator(req.body);

        if(Object.keys(validate_product).length > 0) {
            Object.keys(validate_product).forEach(key => {
                req.flash('errMissingFields',validate_product[key])
            })
            return res.status(402).redirect('/add_product');
        }

        const product = await Product.create({
            name:name,
            category:category,
            price:price,
            offer_price:offerPrice,
            quantity:[{
                small:q_small,
                medium:q_medium,
                large:q_large,
            }],
            description:description,
            image: req.files.map(file=>file.path),
            created_on:Date.now()
        })

        if(product){
            await product.save();
            return res.status(204).redirect('/products')
        }else{
            req.flash('error',"some error occured while adding the product")
            return res.status(402).redirect('/add_product')
        }

    } catch (error) {
       console.error("something happend while adding product",error) 
    }
}

module.exports ={
    get_products,
    get_add_product,
    add_product
}