
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
        console.log("inside not phone");
        errors.phone = "please enter your phone number"
    }else if(!phonePattern.test(phone)){
        errors.phone = "enter a valid phone number"
    }

    return errors;

}

module.exports = {
    primary_validation
}