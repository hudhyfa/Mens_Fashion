
const User = require('../modal/user');
const Otp = require('../modal/otp')
const userValidator = require('../../utils/user_validator')
const { transporter } = require('../../config/nodemailer');
const { generateOtp } = require('../../utils/otpUtils');



const get_homepage = async (req,res) => {
    res.render('user/home')
}

const get_userLogin = async (req,res) => {
    // if user is not logged in
    res.render('user/login');
}

const get_emailValidation = async (req,res) => {
    res.render('user/emailValidation')
}

const get_verifyOtp = async (req,res) => {
    res.render('user/otp')
}

const get_userSignup = async (req,res) => {
    res.render('user/signup')
}


const emailValidation = async (req,res) => {

    try{

        const { email,phone } = req.body;
        req.session.newEmail = email;
        req.session.newPhone = phone;

        // validate input data
        const validationErrors = userValidator.primary_validation(req.body)

        // check if there are validation errors
        if(Object.keys(validationErrors).length > 0){
            Object.keys(validationErrors).forEach( key => {
                req.flash('invalidCreds',validationErrors[key]);
            })
            return res.status(402).redirect('/email_validation');
        }
        
        // check if the user already exists
        const userExists = await User.findOne({email: email})
        const userPhone = await User.findOne({phone: phone})        
        
        if(userExists){
            req.flash("userExists","user with this email already exists")
            return res.status(402).redirect('/email_validation')
        }

        if(userPhone){
            req.flash("userExists","user with this phone already exists")
            return res.status(402).redirect('/email_validation')
        }

        // send otp for email validation
        const otp = await sendOtp(email);

        req.flash("otpInfo","check OTP code in your Gmail inbox")
        return res.status(200).redirect('/otp_verification');
        
    } catch (error) {
        req.flash("validationError","error in validating your email")
        return res.status(402).redirect('/email_validation');
    }
}

const otpValidation = async (req,res) => {
    const { otp } = req.body;
    
    try {
        const email = req.session.newEmail;
        const phone = req.session.newPhone;
        if(!email){
            req.flash('validationError',"Email not found");
            return res.status(402).redirect('/email_validation');
        }

        // find user by email
        const otpData = await Otp.findOne({email: email});
        
        // check if the otp is valid 
        if(!otpData || otpData.otp !== otp){
            req.flash("invalidOtp","invalid otp")
            return res.status(402).redirect("/otp_verification")
        }
        
        // check if the otp is expired 
        const currentTime = new Date().getTime();
        if(otpData.expirationTime < currentTime){
            req.flash("expiredOtp","time has expired");
            return res.status(403).redirect("/otp_verification")
        }

        // create a new user
        const newUser = await User.create({email: email,phone: phone})
        newUser.save()
        console.log(`user created: ${newUser.email}`)

        await otpData.deleteOne();
        delete req.session.newEmail;
        delete req.session.newPhone;
        
        return res.status(402).redirect("/user_signup")
        
    } catch (error) {
        req.flash("validationError","otp validation failed");
        return res.status(402).redirect('/email_validation');
    }
}

const resendOtp = async (req,res) => {
    try {
        const email = req.session.newEmail;

        // update otp in user's doc
        const newOtp = await sendOtp(email)
    
        const currentTime = new Date().getTime();
        const newExpirationTime = currentTime + 5 * 60 * 1000
    
        // find and update the exisiting otp doc
        const updatedOtp = await Otp.findOneAndUpdate({email: email},{otp: newOtp, expirationTime: newExpirationTime},{new: true})
    
        // If the otp doc doesn't exist
        if(!updatedOtp){
            const newUpdatedOtp = await Otp.create({
                email:email,
                otp:newOtp,
                expirationTime: newExpirationTime           
            })
            await newUpdatedOtp.save();
        }
        
        console.log(`Resending OTP: ${newOtp} to ${email}. Expiration Time: ${new Date(newExpirationTime).toLocaleString()}`);
        req.flash('resendOtp',"otp resent , check your gmail again")
        return res.status(200).redirect('/otp_verification')
        
    } catch (error) {
        console.error("Error in otp resend",error.message);
        req.flash("validationError","otp resend failed");
        return res.status(500).redirect('/otp_verification')
    }
    
}

const sendOtp = async (email) => {

    const { otp,expireTime } = generateOtp();

    try{

        const newOtp = await Otp.create({email,otp:otp,expirationTime:expireTime});
        await newOtp.save();

        const mailOptions = {
            from:'"MenxFashion" <hudyfaismail@gmail.com>',
            to: email,
            subject:"verification otp",
            text:`Your OTP for email verification: ${otp} 
            note: will expire at ${new Date(expireTime).toLocaleString()}!!`
        }

        await transporter.sendMail(mailOptions,(err, result)=>{
            if(err){
                console.error(err);
            }else{
                // console.log(result);
                console.log("email sent successfully")
            }
        })

        console.log(`OTP sent to ${email}: ${otp}, Expiration Time: ${new Date(expireTime).toLocaleString()}`);
        return otp;

    }catch(error){
        console.error('Error sending OTP:',error.message);
        throw new Error('Error sending OTP')
    }
}


module.exports = {
    sendOtp,
    resendOtp,
    otpValidation,
    emailValidation,
    get_userLogin,
    get_emailValidation,
    get_homepage,
    get_verifyOtp,
    get_userSignup
}


