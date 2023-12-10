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