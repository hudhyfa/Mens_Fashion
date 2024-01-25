const coupon_validator = function(body){
    const {
       coupon_code,
       type,
       min_purchase_amount,
       discount,
       max_discount_amount,
       expiry_date 
    } = body;

    const errors = {};

    if(!coupon_code.trim()||
       !type.trim()||
       !min_purchase_amount.trim()||
       !discount.trim()||
       !max_discount_amount.trim()||
       !expiry_date
    ){
        errors.errNothing = "Please enter all required fields"
    }

    if(max_discount_amount >= min_purchase_amount){
        errors.invalidMaxDiscount = "Max discontable amount should be lower than Min purchase amount";
    }

    return errors;
}

module.exports = coupon_validator;