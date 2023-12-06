
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

    const { first_name, last_name, profile_img, password, confirm_password} = data;
    
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/

    const errors = {}
    
    // username validation
    if(!first_name || !last_name){
        errors.username = "first and last name required"
    }

    // image url validation
    // if(profile_img){
    //     if(!urlPattern.test(profile_img)){
    //         errors.profile_img = "enter a valid image url"
    //     }
    // }

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

const login_validation = function (data) {

    const { email, password } = data;

    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if(!email){
        errors.missEmail = "enter your email address"
    }else if(!emailPattern.test(email)){
        errors.errEmail = "invalid credentials"
    }

    if(!password){
        errors.missPassword = "enter your password"
    }else if(!passwordPattern.test(password)){
        errors.errPassword = "invalid credentials"
    }

    return errors;
    
}

module.exports = {
    primary_validation,
    secondary_validation,
    login_validation
}