const product_validator = function(body){
    const { 
        name,
        category,
        price,
        offerPrice,
        quantity,
        size,
        description
    } = body;

    const errors = {};

    if(!name||!category||!price||!offerPrice||!description||!quantity||!size) {
        errors.blank = "fields should not be empty";
    }

    return errors;
}

module.exports = product_validator;