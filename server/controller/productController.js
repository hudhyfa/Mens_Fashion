const Product = require('../modal/product');
const Category = require('../modal/category');
const validator = require('../../utils/admin_validator');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const jimp = require('jimp');

const get_products = async (req,res) => {
    try {
        console.log(req.body.currentPage, req.body.filter)
        console.log("inside get products")
        let page = parseInt(req.body.currentPage) || 1;
        const limit = 3;
    
        const productCount = await Product.countDocuments();
        const totalPages = productCount/limit;
        const action = req.body.action

        if(action){
            page += action;
        }
        const skip = (page - 1) * limit;

        async function sortedProductsByPrice(order) {
            return await Product.find()
            .sort({price:order})
            .limit(limit)
            .skip(skip)
            .populate({path:"category",select:["name"]});
        }

        async function filterProductsByStatus(bool){
            return await Product.find({status:bool})
            .limit(limit)
            .skip(skip)
            .populate({path:"category",select:["name"]});
        }

        async function calculateTotalPage(bool) {
            const totalCount = await Product.find({status:bool}).countDocuments();
            const totalPage = totalCount/limit;
            return totalPage
        }

        // const products = await Product.find()
        //     .limit(limit)
        //     .skip(skip)
        //     .populate({path:"category",select:["name"]});

        // const prodCount = products.length;
        // console.log("asd", prodCount);
        

        if(req.body.currentPage && req.body.filterBy == "pricelth" && req.body.filter===false){
            console.log("inside sorted products");
            const sortedProducts = await sortedProductsByPrice(1)
            return res.json({
                products: sortedProducts,
                currentPage: page,
                totalPages
            })
        }else if(req.body.currentPage && req.body.filterBy == "listed" && req.body.filter===true){
            console.log("inside listed products");
            const filteredProducts = await filterProductsByStatus(true);
            const totalPage = await calculateTotalPage(true);
            return res.json({
                products: filteredProducts,
                currentPage: page,
                totalPages:totalPage,
            })
        }else if(req.body.currentPage && req.body.filterBy == "unlisted" && req.body.filter===true){
            console.log("inside unlisted products");
            const filteredProducts = await filterProductsByStatus(false);
            const totalPage = await calculateTotalPage(false);
            return res.json({
                products: filteredProducts,
                currentPage: page,
                totalPages:totalPage,
            })
        }else if(req.body.currentPage && req.body.filterBy == "pricehtl" && req.body.filter===true){
            console.log("inside sorted products");
            const sortedProducts = await sortedProductsByPrice(-1);
            return res.json({
                products: sortedProducts,
                currentPage: page,
                totalPages,
            })
        }else if(req.body.currentPage){
            const products = await sortedProductsByPrice(1);
            return res.json({
                products: products,
                currentPage: page,
                totalPages,
            })
        }else{
            const products = await sortedProductsByPrice(1); 
            return res.status(200).render('admin/products',{products: products, currentPage: page, totalPages})
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

        req.session.images = product.image;
        console.log("inside get edit product",req.session.images)
        
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
        // const croppedImages = [];
        // for (const file of req.files) {

        //     const image = await jimp.read(file.path);
      
        //     const aspectRatio = 16 / 9;
        //     const width = Math.min(image.bitmap.width, image.bitmap.height * aspectRatio);
        //     const height = width / aspectRatio;
        //     const x = (image.bitmap.width - width) / 2;
        //     const y = (image.bitmap.height - height) / 2;
      
        //     const croppedImage = image.crop(x, y, width, height);
      
        //     const uniqueFilename = `cropped_${file.originalname}`;
      
        //     await croppedImage.writeAsync(`uploads/${uniqueFilename}`);
      
        //     croppedImages.push(`uploads/${uniqueFilename}`);
        // }
        // console.log(croppedImages);
      
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
            image: req.files.map(file => file.path),
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

        const oldImages = req.session.images;
        console.log("oldImages",oldImages);
        const newImages = req.files.map(file => file.path);
        console.log("newImages",newImages);
        const allImages = [...oldImages,...newImages];

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
            image : allImages,
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

const search_product = async (req, res) => {
    try {
        const productName = req.body.product_name;
        const regexname = new RegExp(productName, 'i');
        const products = await Product.find({name:{$regex:regexname}})
        
        if(products && products.length > 0) {
            return res.json({
                success:true,
                products
            })
        }else{
            return res.json({
                success:false
            })
        }
    } catch (error) {
        console.log('error while searching for product',error);
    }
}

const filterProducts = async (req, res) => {
    try {
       const degree = req.body.filterBy;
       const [sortByPriceAsc, sortByPriceDesc, filterListed, filterUnlisted] = await Promise.all([
        Product.find().sort({price:1}),
        Product.find().sort({price:-1}),
        Product.find({status:true}),
        Product.find({status:false})
       ])

       if(degree==="pricelth"){
        return res.json({
            success:true,
            products:sortByPriceAsc
        })
       }
       else if(degree==="pricehtl"){
        return res.json({
            success:true,
            products:sortByPriceDesc
        })
       }
       else if(degree==="listed"){
        return res.json({
            success:true,
            products:filterListed
        })
       }
       else if(degree==="unlisted"){
        return res.json({
            success:true,
            products:filterUnlisted
        })
       }

    } catch (error) {
        console.log('error while filtering products',error);
    }
}


module.exports ={
    get_products,
    get_add_product,
    add_product,
    update_status,
    edit_product,
    get_edit_product,
    delete_image,
    search_product,
    filterProducts
}