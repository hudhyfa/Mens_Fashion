const adminLoggedOut = async (req,res,next) => {
    if(req.session.adminAuth == false){
        res.redirect('/admin_login');
    }
    next();
}

const isAdminLogged = async (req,res,next) => {
    if(req.session.adminAuth){
        res.redirect('/admin');
    }
    next();
}

module.exports = {
    adminLoggedOut,
    isAdminLogged
}
