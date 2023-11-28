const user_route = express();
const User = require('../modal/user');
const transporter = require('../../config/nodemailer');
const { generateOtp } = require('../../utils/otpUtils');

const sendOtp = async (email) => {
    const otp = generateOtp();

    try{
        await transporter.sendMail({
            from:"hudyfaismail@gmail.com",
            to: email,
            subject:"verification otp",
            text:`Your OTP for email verification: ${otp}` 
        });

        return otp;
    }catch(error){
        console.error('Error sending OTP',error.message);
        throw new Error('Error sending OTP')
    }
}

const emailValidation = async (req,res) => {
    const { email } = req.body;

    try {

        // check if the user already exists
        const userExists = await User.findOne({email: email})
        if(exsistingUser){
            req.flash("userExists","user already exists")
            res.status(402).redirect('/email_Validation')
        }

        // create a new user
        const newUser = await User.create({email: email})
        newUser.save()

        // send otp for email validation
        const otp = await sendOtp(email);

        // set the otp in user's doc for verification
        newUser.otp = otp;
        await newUser.save();

        req.flash("otpInfo","check OTP code in your Gmail inbox")
        res.status(200).redirect('/otp_Verification');

    } catch (error) {
        req.flash("validationError","error in validating your email")
        res.status(402).redirect('/email_Validation');
    }
}

const otpValidation = async (req,res) => {
    const { email,otp } = req.body;

    try {
        // find user by email
        const user = await User.findOne({email: email});
        
        // check if otp matches
        if(user.otp !== otp){
            req.flash("invalidOtp","invalid otp")
            res.status(402).redirect("/email_validation")
        }

        // mark email as verified
        user.isEmailVerified = true;
        user.save();

        res.status(200).redirect("/home")

    } catch (error) {
        
    }
}

module.exports = {
    sendOtp,
    emailValidation,
    otpValidation
}


