const User = require('../modal/user');

const update_status = async (req,res) => {
    
    const id = req.params.id;

    const user = await User.findOne({_id:id})

    if(user){
        user.status = !user.status
        await user.save()
        
        return res.status(200).redirect('/customers');
    }else{
        console.error("couldn't fetch user data")
    }

}

const get_customers = async (req,res) => {
    
    try {
        
        const customers = await User.find();
        if(customers){
            res.render('admin/users',{ users:customers })
        }else{
            console.error("couldn't fetch users data")
            return res.redirect('/admin')
        }

    } catch (error) {
        console.error("error while getting customer list");
    }

}

module.exports = {
    update_status,
    get_customers
}
