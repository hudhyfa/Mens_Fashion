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

const password_validator = function (body) {

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    const errors = {};

    const {newPass, confirmNewPass} = body;

    if(!passwordPattern.test(newPass) || !passwordPattern.test(confirmNewPass)){
        errors.invalid_format = "password must be at least 8 characters witha uppercase letter and numbers."
    }

    return errors;

}

module.exports = { 
    address_validator,
    password_validator
 }