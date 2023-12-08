const product_validator = function(body){
    const { 
        images,
        name,
        category,
        price,
        offerPrice,
        q_small,
        q_medium,
        q_large,
        description
    } = body;

    const errors = {};

    if(!name||!category||!price||!offerPrice||!q_small||!q_medium||!q_large||!description) {
        errors.blank = "fields should not be empty";
    }

    return errors;
}

module.exports = product_validator;