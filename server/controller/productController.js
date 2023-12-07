

const get_products = async (req,res) => {
    try {
        res.render('admin/products')        
    } catch (error) {
        console.error("Error rendering products page")
    }
}

module.exports ={
    get_products
}