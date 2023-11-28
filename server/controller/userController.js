const user_route = express();
const User = require('../modal/user');
const Otp = require('../modal/otp')
const transporter = require('../../config/nodemailer');
const { generateOtp } = require('../../utils/otpUtils');

const sendOtp = async (email) => {

    const { otp,expireTime } = generateOtp();

    try{

        const newOtp = await Otp.create({email, otp, expireTime});
        await newOtp.save();

        await transporter.sendMail({
            from:"hudyfaismail@gmail.com",
            to: email,
            subject:"verification otp",
            text:`Your OTP for email verification: ${otp} will expire after one minute` 
        });

        console.log(`OTP sent to ${email}: ${otp}, Expiration Time: ${new Date(expireTime).toLocaleString()}`);
        return otp;

    }catch(error){
        console.error('Error sending OTP',error.message);
        throw new Error('Error sending OTP')
    }
}

const emailValidation = async (req,res) => {
    const { email,phone } = req.body;
    req.session.newEmail = email;
    req.session.newPhone = phone;

    try {

        // check if the user already exists
        const userExists = await User.findOne({email: email})
        const userPhone = await User.findOne({phone: phone})
        if(userExists){
            req.flash("userExists","user with this email already exists")
            res.status(402).redirect('/email_Validation')
        }

        if(userPhone){
            req.flash("userExists","user with this phone already exists")
            res.status(402).redirect('/email_Validation')
        }

        // send otp for email validation
        const otp = await sendOtp(email);

        req.flash("otpInfo","check OTP code in your Gmail inbox")
        res.status(200).redirect('/otp_Verification');

    } catch (error) {
        req.flash("validationError","error in validating your email")
        res.status(402).redirect('/email_Validation');
    }
}

const otpValidation = async (req,res) => {
    const { otp } = req.body;
    
    try {
        const email = req.session.newEmail;
        const phone = req.session.newPhone;
        if(!email){
            req.flash('validationError',"Email not found");
            res.status(402).redirect('/email_validation');
        }

        // find user by email
        const otpData = await Otp.findOne({email: email});
        
        // check if otp matches
        if(!otpData || otpData.otp !== otp){
            req.flash("invalidOtp","invalid otp")
            res.status(402).redirect("/otp_verification")
        }
        
        // check if the otp is still valid
        const currentTime = new Date().getTime();
        if(otpData.expirationTime < currentTime){
            req.flash("invalidOtp","time has expired");
            res.status(403).redirect("/otp_verification")
        }

        // create a new user
        const newUser = await User.create({email: email,phone: phone})
        newUser.save()
        console.log(`user created: ${newUser.email}`)

        await otpData.delete();
        delete req.session.newEmail;
        delete req.session.newPhone;
        
        res.status(200).redirect("/home")

    } catch (error) {
        req.flash("validationError","otp validation failed");
        res.status(402).redirect('/email_Validation');
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
        const updatedOtp = await Otp.findOneAndUpdate({email: email},{ otp: newOtp, expirationTime: newExpirationTime},{new: true})
    
        // If the otp doc doesn't exist
        if(!updatedOtp){
            const newUpdatedOtp = await Otp.create({
                email:email,
                otp:newOtp,
                expirationTime: newExpirationTime           
            })
            await newUpdatedOtp.save();
        }

        console.log(`Resending OTP to ${email}. Expiration Time: ${new Date(newExpirationTime).toLocaleString()}`);
        res.status(200).redirect('otp_validation')
        
    } catch (error) {
        console.error("Error in otp resend",error.message);
        req.flash("validationError","otp resend failed");
        res.status(500).redirect('otp_validation')
    }

}

module.exports = {
    sendOtp,
    resendOtp,
    emailValidation,
    otpValidation
}


