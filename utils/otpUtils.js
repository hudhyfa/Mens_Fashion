const generateOtp = ()=>{
    return Math.floor(Math.random() * 9000).toString();
}

module.exports = { generateOtp }