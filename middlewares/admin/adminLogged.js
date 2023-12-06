const adminLoggedIn = async (req,res,next) => {
    if(!req.session.adminAuth){
        res.redirect('/admin_login');
    }
    next();
}

module.exports = {
    adminLoggedIn
}
