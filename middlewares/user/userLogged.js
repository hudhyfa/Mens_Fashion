const User = require('../../server/modal/user.js');
const { request } = require('../../server/routes/user_route.js');

const userLoggedIn = (req,res,next) => {
    console.log(req.session.userAuth);
    if(req.session.userAuth){
        const id = req.session.userId;
        return res.status(200).redirect(`/user-profile/${id}`);
    }
    next();
}

const validUser = async (req,res,next) => {
    try {
        console.log(req.session.userAuth);
        if(req.session.userAuth){
    
            const id = req.session.userId;
            console.log("before checking status");
            const user = await User.findById({_id:id});
        
            if(user.status === true){
                console.log("after checking status");
                next();
            }else{
                req.session.userAuth = false;
                delete req.session.userId;
                delete req.session.username;
        
                return res.status(403).redirect('/user_login');
            }
    
        }else{
            console.log("in else");
            return res.status(403).redirect('/user_login');
        }
    } catch (error) {
        console.error(error);
    }



}

module.exports = {
    userLoggedIn,
    validUser
}