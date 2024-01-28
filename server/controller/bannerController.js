const Banner = require('../modal/banner');

const get_banners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(202).render('admin/banners',{banners: banners});
    } catch (error) {
        console.log(error);
        res.status(404).render('admin/error', {errMsg:"error occured while rendering banners page"})
    }
}

const get_add_banner = async (req, res) => {
    try {
        res.status(200).render('admin/addBanner');
    } catch (error) {
        console.log("error while getting add banner page", error);
        res.status(404).render('admin/error', {errMsg:"error occured while getting add banner page"});
    }
}

const get_edit_banner = async (req, res) => {
    try {
        const banner = await Banner.findOne({_id: req.params.id})
        res.status(200).render('admin/editBanner',{banner: banner});
    } catch (error) {
        console.log("error while getting edit banner page", error);
        res.status(404).render('admin/error', {errMsg:"error occured while getting edit page"});
    }
}

const add_banner = async (req, res) => {
    try {
        const {
            banner_img,
            banner_heading,
            banner_subHeading,
            banner_description
        } = req.body;

        if(!banner_img.trim()||banner_heading.trim()||banner_subHeading.trim()||banner_description.trim()){
            req.flash("invalidFields","Empty fields are not allowed");
            res.status(403).redirect('/add-banner');
        }

        await Banner.create({
            bg_img: banner_img,
            heading: banner_heading,
            sub_heading: banner_subHeading,
            description: banner_description
        })

        console.log("new banner created");

        res.status(202).redirect('/banners');

    } catch (error) {
        console.log("error occured while adding banner", error);
        res.status(404).render('admin/error', {errMsg:"error occured while adding banner"});
    }
}

const edit_banner = async (req, res) => {
    try {
        const {
            banner_img,
            banner_heading,
            banner_subHeading,
            banner_description
        } = req.body;


        if(!banner_img.trim()||!banner_heading.trim()||!banner_subHeading.trim()||!banner_description.trim()){
            req.flash("invalidFields","Empty fields are not allowed");
            return res.status(403).redirect(`/edit-banner/${req.params.id}`);
        }

        const editedBanner = {
            bg_img: banner_img,
            heading: banner_heading,
            sub_heading: banner_subHeading,
            description: banner_description
        }

        await Banner.updateOne(
            {_id:req.params.id},
            editedBanner
        )

        res.status(200).redirect('/banners');

        console.log("banner updated successfully");



    } catch (error) {
        console.log("error occured while editing banner", error);
        res.status(404).render('admin/error', {errMsg:"error occured while editing banner"});
    }
}



module.exports = {
    get_banners,
    get_add_banner,
    add_banner,
    get_edit_banner,
    edit_banner
}