const Category = require('../modal/category')

// const get_categories = async(req,res) => {
//     try {
//         res.render('admin/categories')
//     } catch (error) {
//         console.error("Error rendering categories")
//     }
// }

const get_subCategories = async(req,res) => {
    try {        
        res.render('admin/subCategories')
    } catch (error) {
       console.error("Error rendering sub categories") 
    }
}

const get_add_category = async(req,res) => {
    try {
       res.render('admin/addCategories') 
    } catch (error) {
        console.error("error rendering add categories")
    }
}

// * to add a category
const add_category = async (req,res) => {
    try {

        const { category_name, category_desc } = req.body;

        if(category_name && category_desc){

            const category_exists = await Category.findOne({category_name: category_name})

            if(category_exists){
                req.flash('catExists',"Category already exists")
                return res.status(402).redirect('/categories')
            }else{
                const new_category = await Category.create({
                    name: category_name,
                    description: category_desc
                })
                await new_category.save();
                console.log(`Added category ${new_category}.`)

                return res.status(200).redirect('/categories')
            }

        }else{
           req.flash('errInput',"Please enter all details")
           return res.status(402).redirect('/categories') 
        }

    } catch (error) {
       console.error("Error adding category");
       req.flash("error","Error occurred while adding category")
       return res.status(402).redirect('/categories') 
    }
}

// * to show categories
const get_categories = async (req,res) => {
    try {
        const categories = await Category.find();

        if(categories){
            res.render('admin/categories',{categories:categories})
        }else{
            console.error("couldnt fetch categories")
        }

    } catch (error) {
        console.error("Error rendering categories page")
    }
}


module.exports = {
    get_subCategories,
    get_categories,
    get_add_category,
    add_category,
}