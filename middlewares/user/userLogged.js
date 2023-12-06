const userLoggedIn = (req,res,next) => {
    if(req.session.userAuth){
        res.render('user/userProf',{name: req.session.username})
    }
    next();
}

module.exports = {
    userLoggedIn,
}