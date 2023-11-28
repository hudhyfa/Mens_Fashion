const generateOtp = ()=>{
    const otp =  Math.floor(Math.random() * 9000).toString();
    const expireTime = new Date().getTime() + 5 * 60 * 1000;

    return {otp, expireTime};
}

module.exports = { generateOtp }