const User = require('../modal/user')
const Address = require('../modal/address')
const profileValidator = require('../../utils/profile_validator')


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

        // * get all addresses from address collection using user's id.
        const [user, address] = await Promise.all([
            User.findById({_id:id}),
            Address.find({user_id:id})
        ])

        res.render('user/address',{user:user,address:address})
    } catch (error) {
        throw new Error("error rendering address page: \n", error)
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

const get_edit_address = async (req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({_id:id});
        res.render('user/edit-address',{user:user})
    } catch (error) {
        throw new Error("error rendering edit address page: \n", error)
    }
}

const get_security = async (req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({_id:id});
        res.render('user/security',{user:user});
    } catch (error) {
        throw new Error("error rendering security page: \n", error)
    }
}

const get_coupon = async (req,res) => {
    try {
       const id = req.params.id;
       const user = await User.findById({_id:id});
       res.render('user/coupon',{user:user})
    } catch (error) {
        throw new Error("error rendering coupon page: \n", error)
    }
}

const add_wallet = async (req,res) => {
    try {
        const id = req.params.id;
        const credit_wallet = req.body.bucks;


        //* add money to user's wallet
        console.log("before updating wallet")
        const update_wallet = await User.findOneAndUpdate({_id:id},{$inc:{wallet:credit_wallet}},{new:true});
        if(update_wallet){
            console.log("after updating wallet")
            return res.status(200).redirect(`/wallet/${id}`);
        }else{
            console.error("Error updating wallet",error)  
        }

    } catch (error) {
        throw new Error("error adding wallet: \n", error)
    }
}

const add_address = async (req,res) => {
    try {
        const id = req.params.id;

        const check_info = profileValidator.address_validator(req.body);

        if(Object.keys(check_info).length > 0){
            Object.keys(check_info).forEach(key => {
                req.flash('errMissingDetails',check_info[key])
            })
            return res.status(403).redirect(`/add-address/${id}`);
        }

        const { 
            name,
            state,
            country,
            pincode,
            landmark,
            title
        } = req.body;

        const create_address = await Address.create({
            user_id: id,
            name: title,
            house_name: name,
            state: state,
            country: country,
            pincode: pincode,
            landmark: landmark,
        })

        if(create_address){
            return res.status(200).redirect(`address/${id}`)
        }else{
            req.flash("errCreatingAddress","couldn't create address try again")
            return res.status(403).redirect(`/add-address/${id}`);
        }



    } catch (error) {
      throw new Error("error adding address: \n", error)  
    }
}


module.exports = {
    get_userProfile,
    get_wallet,
    get_address,
    get_add_address,
    get_edit_address,
    get_security,
    get_coupon,
    add_wallet,
    add_address
}