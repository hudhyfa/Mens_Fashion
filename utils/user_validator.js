
const primary_validation = function (data) {

    const { email, phone } = data;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;

    const errors = {}

    // email validation
    if(!email){
        errors.email = "please enter your email id"
    }else if(email.length < 1 || email.trim() == "" || !emailPattern.test(email)){
        errors.email = "enter a valid email id"
    }
    
    // phone validation
    if(!phone){
        errors.phone = "please enter your phone number"
    }else if(!phonePattern.test(phone)){
        errors.phone = "enter a valid phone number"
    }

    return errors;

}

const secondary_validation = function (data) {
    const { password, confirm_password} = data;
    
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    const errors = {}

    // password validation
    if(!password || !confirm_password){
        errors.password = "please enter your password"
    }else if(!passwordPattern.test(password)){
        errors.password = "password must include a number, capital letter and atleast 8 characters"
    }else if(!passwordPattern.test(confirm_password)){
        errors.password = "try again"
    }

    return errors;

}

module.exports = {
    primary_validation,
    secondary_validation
}