const generateOtp = ()=>{
    const otp =  Math.floor(Math.random() * 9000).toString();
    // console.log(`otp: ${otp}`);
    const expireTime = new Date().getTime() + 5 * 60 * 1000;
    return {otp, expireTime};
}

module.exports = { generateOtp }