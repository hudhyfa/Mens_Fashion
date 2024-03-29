const Category = require('../modal/category')

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

        const category_exists = await Category.findOne({name : category_name})

        if(category_exists){
            req.flash('catExists',"Category already exists")
            return res.status(402).redirect('/add_category')
        }else{
            const new_category = await Category.create({
                name: category_name,
                description: category_desc
            })
            await new_category.save();

            return res.status(200).redirect('/categories')
        }

    } catch (error) {
       console.error("Error adding category",error);
       return res.status(402).redirect('/categories') 
    }
}

// * to show categories
const get_categories = async (req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 2;
        const skip = (page - 1) * limit;
        const count = await Category.countDocuments();
        const totalPages = count/limit;

        const categories = await Category.find().limit(limit).skip(skip);

        if(categories){
            res.render('admin/categories',{categories:categories,currentPage:page,totalPage:totalPages})
        }else{
            console.error("couldnt fetch categories")
        }

    } catch (error) {
        console.error("Error rendering categories page")
    }
}

// * to update status of category
const update_category_status = async (req,res) => {
    try {
        const id = req.params.id;

        const category = await Category.findOne({_id:id});

        if(category){
            category.listed = !category.listed;
            await category.save();
            return res.status(200).redirect('/categories');
        }else{
            console.error("error not found",error);
        }

    } catch (error) {
        console.error("Error updating category status",error)
    }
}

// * to get edit category page
const get_edit_category = async (req,res) => {
    try {
        const id = req.params.id;

        const category = await Category.findOne({_id:id});

        if(category){
            res.render('admin/editCategories',{category:category})
        }else{
            console.error("error occured while fetching category",error);
        }
    } catch (error) {
        console.error(" category not found",error)
    }
}

// * to update a category
const update_category = async (req,res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        if(!name || !description) {
            req.flash('errNothing',"Edit the category name and description to update")
            return res.status(402).redirect(`/edit_category/${id}`);
        }

        const category = await Category.findOneAndUpdate({_id:id},{name:name,description:description},{new:true});
        await category.save();
        return res.status(200).redirect('/categories')

    } catch (error) {
        req.flash('errUpdating',"error occured while updating category",error);
        return res.status(402).redirect(`/edit_category/${id}`);
    }
}

module.exports = {
    get_subCategories,
    get_categories,
    get_add_category,
    add_category,
    update_category_status,
    get_edit_category,
    update_category
}