const Coupon = require('../modal/coupon');

const get_coupons = async (req, res) => {
    try {
       res.status(200).render('admin/coupons'); 
    } catch (error) {
        console.log("error while fetching Coupons", error);
        res.status(404).render('user/error',{errMsg:"error while fetching coupons try again !"})
    }
}

const add_coupon = async (req,res) => {
    try {
        
    } catch (error) {
       console.log("error while adding coupon:",error);
       res.status(404).render('user/error',{errMsg:"error occured while adding coupon try again !"})
    }
}

module.exports = {
    get_coupons,
    add_coupon
}