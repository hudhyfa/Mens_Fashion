const Product = require('../modal/product');
const Category = require('../modal/category');
const validator = require('../../utils/admin_validator');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const get_products = async (req,res) => {
    try {
        const products = await Product.find().populate({path:"category",select:["name"]});
        if(products){
            res.render('admin/products',{products:products});        
        }else{
            return res.status(404).redirect('/admin');
        }
    } catch (error) {
        console.error("Error rendering products page",error)
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

const get_edit_product = async (req,res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        const [product, categories] = await Promise.all([
            Product.findOne({_id:new ObjectId(id)}),
            Category.find()
        ]);
        
        const category = await Category.findOne({_id:product.category})
        console.log(category);
        res.render('admin/editProduct',{product:product,categories:categories,category:category})

    } catch (error) {
        console.error("Error rendering editProduct page",error)
        throw new Error("error occured while editing:",error.message)
    }
}

const add_product = async (req,res) => {
    try {
        const { 
            name,
            category,
            price,
            offerPrice,
            description,
            quantityXS,
            quantityS,
            quantityM,
            quantityL,
            quantityXL,
            quantityXXL
        } = req.body;

        const validate_product = validator(req.body);

        if(Object.keys(validate_product).length > 0) {
            Object.keys(validate_product).forEach(key => {
                req.flash('errMissingFields',validate_product[key])
            })
            return res.status(402).redirect('/add_product');
        }
        console.log(req.files)
        const product = await Product.create({
            name:name,
            category:category,
            price:price,
            offer_price:offerPrice,
            stock:[
                {
                    size:'XS',
                    quantity:quantityXS
                },
                {
                    size:'S',
                    quantity:quantityS
                },
                {
                    size:'M',
                    quantity:quantityM
                },
                {
                    size:'L',
                    quantity:quantityL
                },
                {
                    size:'XL',
                    quantity:quantityXL
                },
                {
                    size:'XXL',
                    quantity:quantityXXL
                }
            ],
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

const update_status = async (req,res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({_id:id})

        if(!product){
            throw new Error("Product not found")
        }
        
        product.status =!product.status;
        await product.save();
        return res.status(204).redirect('/products')
    } catch (error) {
        throw new Error(`something happend while updating product status: ${error}`)
    }
}

const edit_product = async (req,res) => {
    try {

        const id = req.params.id;

        const { 
            name,
            category,
            price,
            offerPrice,
            description,
            quantityXS,
            quantityS,
            quantityM,
            quantityL,
            quantityXL,
            quantityXXL
        } = req.body;

        console.log(req.body)

        const validate_product = validator(req.body);

        if(Object.keys(validate_product).length>0){
            Object.keys(validate_product).forEach(key => {
                req.flash('errMissingFields',validate_product[key]);
            })
            return res.status(402).redirect(`/edit-product/${id}`)
        }

        // console.log(req.files)
        const update_body =
        {
            name:name,
            category:category,
            price:price,
            offer_price:offerPrice,
            stock:[
                {
                    size:'XS',
                    quantity:quantityXS
                },
                {
                    size:'S',
                    quantity:quantityS
                },
                {
                    size:'M',
                    quantity:quantityM
                },
                {
                    size:'L',
                    quantity:quantityL
                },
                {
                    size:'XL',
                    quantity:quantityXL
                },
                {
                    size:'XXL',
                    quantity:quantityXXL
                }
            ],
            description:description,
            image : [

                ...req.files.map(file=>file.path)
            ],
            updated_on:Date.now()
        }
        

        const update_product = await Product.updateOne({_id:id},{$set:update_body})

        if(update_product.nModified === 0){
            req.flash('errEdit',"error while updating product :",error)
            return res.status(402).redirect(`/edit-product/${id}`)
        }

        return res.status(200).redirect('/products');

    } catch (error) {
        throw new Error(`Error occured while editing the product: ${error}`)
    }
}

const delete_image = async (req, res) => {
    try {
        const image_path = req.query.path;
        const product_id = req.query.id;

        if(image_path && product_id) {
            const product = await Product.findOneAndUpdate({_id:product_id},{$pull:{image:image_path}})
            if(product) {
                console.log("image deleted successfully");
                res.status(200).redirect(`/edit-product/${product_id}`)
            }
        }

    } catch (error) {
        console.error('error while deleting image:',error);
        throw new Error(`Error occured while deleting image`)
    }
}



module.exports ={
    get_products,
    get_add_product,
    add_product,
    update_status,
    edit_product,
    get_edit_product,
    delete_image
}