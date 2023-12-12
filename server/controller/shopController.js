const Product = require('../modal/product')

const shop_products = async (req,res) => {
    try {
        const products = await Product.find().populate({path:"category",select:"name"})
        res.render('user/shop',{products:products})
    } catch (error) {
        throw new Error('error while rendering shopping page: ' + error)
    }
}

module.exports = {
    shop_products
}