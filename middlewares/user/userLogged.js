const User = require('../../server/modal/user.js');

const userLoggedIn = (req,res,next) => {
    if(req.session.userAuth){
        // const user = User.findOne({_id:req.session.userId})
        // console.log(user.username);
        res.render('user/profile');
    }
    next();
}

module.exports = {
    userLoggedIn,
}