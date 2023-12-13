const Product = require('../modal/product')

const shop_products = async (req,res) => {
    try {
        const products = await Product.find().populate({path:"category",select:"name"})
        res.render('user/shop',{products:products})
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

module.exports = {
    shop_products,
    view_product
}