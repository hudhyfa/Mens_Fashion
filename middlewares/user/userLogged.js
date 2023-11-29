const userLoggedIn = (req,res,next) => {
    if(req.session.userAuth){
        res.render('userProf',{name: req.session.userName})
    }
    next();
}

module.exports = {
    userLoggedIn,
}