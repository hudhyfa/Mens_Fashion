const get_categories = async(req,res) => {
    try {
        res.render('admin/categories')
    } catch (error) {
        console.error("Error rendering categories")
    }
}
const get_subCategories = async(req,res) => {
    try {        
        res.render('admin/subCategories')
    } catch (error) {
       console.error("Error rendering sub categories") 
    }
}


module.exports = {
    get_subCategories,
    get_categories,
}