const Product = require('../modal/product');
const Category = require('../modal/category')
// const { request } = require('../routes/user_route');

const shop_products = async (req,res) => {
    try {

        let page = parseInt(req.body.currentPage) || 1;
        const limit = 2;
        const action = req.body.action;
        if(action){
            page += action;
        }
        const skip = (page - 1)*limit;
        const from = skip + 1;
        const to = skip + limit;

        const products = await Product.find()
            .populate({path:"category",select:"name"})
            .limit(limit)
            .skip(skip)

        const totalProducts = await Product.countDocuments(); // count of products

        const totalPages = Math.ceil(totalProducts / limit); // total number of pages
        
        if(req.body.currentPage){
            res.json({
                success:true,
                products,
                page,
                totalPages,
                from,
                to,
                totalProducts
            })
        }else{
            await res.render('user/shop',{products, currentPage:page, totalPages:totalPages, totalProducts, from, to})
        }


    } catch (error) {
        throw new Error('error while rendering shopping page: ' + error)
    }
}

const view_product = async (req,res) => {
    try {
        const id = req.params.id;

        const product = await Product.findById({_id:id}).populate({path:"category",select:"name"})

        if(product){
            const related_products = await Product.find({category:product.category})
            res.render('user/view-product',{product:product, related_products:related_products})
        }else{
            console.error('product not found',error)
            return res.status(403).redirect('/show-products')
        }

    } catch (error) {
        throw new Error('error while viewing product: ' + error)
    }
}

const search_product = async (req,res) => {
    try {
        console.log("insode logins")
        console.log(req.body.product)
        const searched_product = req.body.product;
        

        //! if user doesnt enter a product name and search..
        if(!searched_product || searched_product === ''){
            const invalidProduct = "enter a valid product"
             res.json({
                success:false,
                invalidProduct
            })
        }

        // * first look for the searched name in both category and products. 
        const regex = new RegExp(searched_product, 'i')        
        const [category, products_by_name] = await Promise.all([
            Category.findOne({name:searched_product}),
            Product.find({name:{$regex:regex}})
        ])
        console.log("asdf",category, products_by_name);

        //* if name mathes category return all products in that category.
        //* else if name matches a product return that or all products with that name.
        if(category){
            const products_by_category = Product.find({category:category._id});
             res.json({
                success:true,
                products_by_category
            }) 
        }else if(products_by_name){
             res.json({
                success:true,
                products_by_name
            })
        }else{
            const invalidProduct = "product not found"
             res.json({
                success:false,
                invalidProduct
            })
        }

    } catch (error) {
        console.error(error);
        throw new Error('error while searching product',error)
    }
}

module.exports = {
    shop_products,
    view_product,
    search_product
}