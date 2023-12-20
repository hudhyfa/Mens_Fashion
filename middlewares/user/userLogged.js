const User = require('../../server/modal/user.js');

const userLoggedIn = (req,res,next) => {
    if(req.session.userAuth){
        console.log("in user middleware");
        const id = req.session.userId;
        console.log(id);
        return res.status(200).redirect(`/user-profile/${id}`);
    }
    next();
}

module.exports = {
    userLoggedIn,
}