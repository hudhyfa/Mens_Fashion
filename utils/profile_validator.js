const address_validator = function (body) {

    const {name, state, country, pincode, landmark, title} = body;

    const errors = {};

    if(!name || !state || !country || !landmark || !title || !pincode) {
        errors.missing_fields = "kindly enter all the details."
    }
    else if(pincode.length != 6){
        errors.invalid_pincode = "Invalid pincode."
    }

    return errors;

}

module.exports = { address_validator }