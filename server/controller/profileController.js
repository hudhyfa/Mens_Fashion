const User = require('../modal/user')

const get_userProfile = async (req,res) => {
    try {
        console.log("in user profile")
        const id = req.params.id;
        console.log(id);
        const user = await User.findById({_id:id})
        res.render('user/profile',{user:user})
    } catch (error) {
        throw new Error("error rendering sample page: \n", error)
    }
}

const get_wallet = async (req,res) => {
    try {
        console.log("in valet")
        const id = req.params.id;
        const user = await User.findById({_id:id});
        res.render('user/valet',{user:user})
    } catch (error) {
       throw new Error("error rendering valet page: \n", error) 
    }
}

const get_address = async (req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({_id:id});
        res.render('user/address',{user:user})
    } catch (error) {
        
    }
}

const get_add_address = async (req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({_id:id});
        res.render('user/add-address',{user:user})
    } catch (error) {
       throw new Error("error rendering add address page: \n", error)
    }
}


module.exports = {
    get_userProfile,
    get_wallet,
    get_address,
    get_add_address
}