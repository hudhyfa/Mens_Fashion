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

    if(parseFloat(max_discount_amount) > parseFloat(min_purchase_amount)){
        errors.invalidMaxDiscount = "Max discountable amount should be lower than Min purchase amount";
    }

    // if(type.trim() !== "flat" || type.trim() !== "percentage"){
    //     console.log("type: " + type);
    //     errors.invalidType = "enter either percentage or flat in type field !"
    // }

    if(type === "percentage"){
        console.log("inside percentage if",type);
        if(discount <= 0 || discount > 99){
            errors.invalidDiscount = "discount percentage should be between 0 and 100"
        }
    }

    if(parseFloat(min_purchase_amount) <= 0 || parseFloat(discount) <= 0 || parseFloat(max_discount_amount) <= 0){
        errors.invalidAmount = "All amounts should be greater than zero";
    }

    return errors;
}

module.exports = coupon_validator;