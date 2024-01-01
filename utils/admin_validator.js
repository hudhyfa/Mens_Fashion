const product_validator = function(body){
    const { 
        name,
        category,
        price,
        offerPrice,
        description,
        quantityXS,
        quantityS,
        quantityM,
        quantityL,
        quantityXL,
        quantityXXL
    } = body;

    const errors = {};

    if(price < 0||price === 0||offerPrice < 0||offerPrice === 0){
        errors.invalidPrice = "price must be above zero";
    }

    if(quantityL < 0||quantityXL < 0||quantityXXL < 0||quantityXS < 0||quantityS < 0||quantityM < 0){
        errors.invalidQuantity = "quantity must be zero or above";
    }

    if(!name||
       !category||
       !price||
       !offerPrice||
       !description||
       !quantityXS||
       !quantityS||
       !quantityM||
       !quantityL||
       !quantityXL||
       !quantityXXL
       ) {
        errors.blank = "fields should not be empty";
    }

    return errors;
}

module.exports = product_validator;