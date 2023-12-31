const User = require('../modal/user');
const adminValidator = require('../../utils/user_validator')
const bcrypt = require('bcrypt');

const admin_dashboard = async (req, res) => {
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.error("Error rendering admin dashboard")
    }
}

const get_adminLogin = async (req, res) => {
    try {
        res.render('admin/adminLogin')
    } catch (error) {
        console.error("Error rendering admin login")
    }
}

const adminLogin = async (req,res) => {

    try {
        
        const { email, password } = req.body;
    
        const cred_validator = adminValidator.login_validation(req.body);
    
        if(Object.keys(cred_validator).length > 0) {
            Object.keys(cred_validator).forEach(key => {
                req.flash('invalidCreds',cred_validator[key]);
            })
            return res.status(402).redirect('/admin_login');
        }
    
        const admin = await User.findOne({isAdmin: true});
    
        if(admin) {
            if(admin.email === email){
                const checkPassword = await bcrypt.compare(password, admin.password);
                if(checkPassword){
                    req.session.adminAuth = true;
                    return res.status(200).redirect('/admin');
                }else{
                    req.flash('wrngPassword',"incorrect credentials")
                    return res.status(402).redirect('/admin_login')
                }
            }else{
                req.flash('wrngEmail',"incorrect credentials")
                return res.status(402).redirect('/admin_login');
            }
        }else{
            req.flash('wrngCreds',"incorrect credentials try again");
            return res.status(402).redirect('/admin_login');
        }

    } catch (error) {
        req.flash('error',"error occurred while logging in");
        return res.status(402).redirect('/admin_login');   
    }


}

const adminLogout = async (req,res) => {
    
    try {

        req.session.adminAuth = false;
        return res.status(200).redirect('/admin_login');

    } catch (error) {
        req.flash('error',"error occurred while logging out");
        return res.status(402).redirect('/admin_login');
    }
    
}


module.exports = {
    get_adminLogin,
    admin_dashboard,
    adminLogin,
    adminLogout,
}