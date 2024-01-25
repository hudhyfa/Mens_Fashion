const Coupon = require('../modal/coupon');
const couponValidator = require('../../utils/coupon_validator');
const { response } = require('../routes/user_route');

const get_coupons = async (req, res) => {
    try {
       const coupons = await Coupon.find(); 
       res.status(200).render('admin/coupons',{coupons:coupons}); 
    } catch (error) {
        console.log("error while fetching Coupons", error);
        res.status(404).render('user/error',{errMsg:"error while fetching coupons try again !"})
    }
}

const get_add_coupon = async (req,res) => {
    try {
        res.status(200).render('admin/addCoupon');
    } catch (error) {
       console.log("error while adding coupon:",error);
       res.status(404).render('user/error',{errMsg:"error occured while adding coupon try again !"})
    }
}

const add_coupon = async (req, res) => {
    try {
        const {
            coupon_code,
            type,
            min_purchase_amount,
            discount,
            max_discount_amount,
            expiry_date 
         } = req.body;

         const validate_coupon = couponValidator(req.body);

         if(Object.keys(validate_coupon).length > 0) {
            Object.keys(validate_coupon).forEach(key => {
                req.flash('error',validate_coupon[key]);
            });
            return res.status(404).redirect('/add-coupon');
         }

        // let couponCode = coupon_code.toUpperCase().replace(/ /g, '');
        //  console.log("couponCode: " + couponCode);
        //  console.log("all amounts",discount,min_purchase_amount,max_discount_amount);
        
         await Coupon.create({
            coupon_code: coupon_code.toUpperCase().replace(/ /g, ''),
            type: type,
            min_purchase_amount: min_purchase_amount,
            discount: discount,
            max_discount_amount: max_discount_amount,
            expiry_date: expiry_date,
         })

         console.log("new Coupon created");

         res.status(200).redirect('/coupons');
    } catch (error) {
        console.log("error while adding coupon:",error);
        res.status(404).render('user/error',{errMsg:"error occured while adding coupon try again !"})
    }
}

const update_coupon_status = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({_id: req.params.id});
        coupon.status = !coupon.status;
        await coupon.save();
        res.status(200).redirect('/coupons');
    } catch (error) {
        console.log("error while updating coupon status",error);
        res.status(404).render('user/error',{errMsg:"error occured while updating coupon status"});
    }
}

const get_edit_coupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({_id: req.params.id});
        res.status(200).render('admin/editCoupon',{coupon: coupon});
    } catch (error) {
        console.log("error while getting edit coupon page",error);
        res.status(404).render('user/error',{errMsg:"error occured while rendering edit coupon page"});   
    }
}

const edit_coupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({_id: req.params.id});

        const {
            coupon_code,
            type,
            min_purchase_amount,
            discount,
            max_discount_amount,
            expiry_date 
         } = req.body;

        const validateCoupon = couponValidator(req.body);

        if(Object.keys(validateCoupon).length > 0) {
            Object.keys(validateCoupon).forEach(key => {
                req.flash("error",validateCoupon[key]);
            })
            return res.redirect(`/get-update-coupon/${req.params.id}`);
        }

        const editedCoupon = {
            coupon_code: coupon_code.toUpperCase().replace(/ /g, ''),
            type: type,
            min_purchase_amount: min_purchase_amount,
            discount: discount,
            max_discount_amount: max_discount_amount,
            expiry_date: expiry_date
        }

        await Coupon.updateOne({_id: req.params.id},editedCoupon);

        console.log("coupon updated !")

        return res.status(201).redirect('/coupons');

    } catch (error) {
       console.log("error while editing coupon",error);
       res.status(404).render('user/error',{errMsg:"error while editing coupon"}); 
    }
}

module.exports = {
    get_coupons,
    get_add_coupon,
    add_coupon,
    update_coupon_status,
    get_edit_coupon,
    edit_coupon
}