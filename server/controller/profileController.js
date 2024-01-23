const User = require('../modal/user')
const Address = require('../modal/address')
const Order = require('../modal/order')
const Wallet = require('../modal/wallet')
const profileValidator = require('../../utils/profile_validator')
const bcrypt = require('bcrypt');


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
        const [user,wallet] = await Promise.all([
            User.findById({_id:id}),
            Wallet.findOne({user_id:id})
        ])
        res.render('user/valet',{user:user,wallet:wallet})
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
        console.log(req.session.userId);
        const [user,address] = await Promise.all([
            User.findById({_id:req.session.userId}),
            Address.findById({_id:id})
        ])
        // const user = await User.findById({_id:id});
        res.render('user/edit-address',{user:user,address:address})
    } catch (error) {
        console.error(error.message)
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

const get_orders = async (req,res) => {
    try {
        const id = req.params.id;
        const [user, orders] = await Promise.all([
            User.findOne({_id:id}),
            Order.find({user_id:id})    
        ])

        const populatedOrders = await Promise.all(orders.map(async order => {
            const populatedOrder = await Order.populate(order, [
              { path: 'address_id', select: 'name' },
              { path: 'products.product_id', select: 'name image' }
            ]);
            return populatedOrder;
        }));
        
        res.render('user/orders',{user:user,orders:populatedOrders})
    } catch (error) {
        console.error("error rendering order page: \n", error)
    }
}

const add_wallet = async (req,res) => {
    try {
        const id = req.params.id;
        const credit_wallet = req.body.bucks;
        const wallet = await Wallet.findOne({user_id: id});

        if(wallet){
            let newTransaction = {
                transaction_amount: req.body.bucks,
                transaction_type: "Credit",
                transaction_date: new Date()
            }
            await Wallet.updateOne(
                {user_id:id},
                {
                    $inc:{amount: req.body.bucks},
                    $push:{transactions: newTransaction}
                }
            )
            console.log(`${req.body.bucks} credited to wallet!`)
        }else{
            await Wallet.create({
                user_id: id,
                amount: 100 + parseInt(req.body.bucks),
                transactions:[{
                    transaction_amount: parseInt(req.body.bucks),
                    transaction_type: "Credit",
                    transaction_date: new Date()
                }]
            })
            console.log("wallet created and amount added to wallet!")
        }

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
            return res.status(200).redirect(`/address/${id}`)
        }else{
            req.flash("errCreatingAddress","couldn't create address try again")
            return res.status(403).redirect(`/add-address/${id}`);
        }

    } catch (error) {
    //   throw new Error("error adding address: \n", error) 
        console.error("error adding address: \n", error) 
    }
}

const delete_address = async (req,res) => {
    try {
        const address_id = req.params.id;
        const user_id = req.body.userId;

        const del_address = await Address.deleteOne({_id:address_id});

        if(del_address){
            res.status(200).redirect(`/address/${user_id}`);
        }else{
            console.error("error occured while deleting address: \n",error)
            res.status(402).redirect(`/address/${user_id}`);
        }

    } catch (error) {
        console.error("error deleting address",error) 
        throw new Error("error deleting address",error)
    }
}

const edit_address = async (req,res) => {
    try {
       const id = req.params.id;

       const { title, name, state, country, pincode, landmark} = req.body;

       const check_info = profileValidator.address_validator(req.body);
       if(Object.keys(check_info).length > 0){
        Object.keys(check_info).forEach(key => {
            req.flash("errMissingDetails", check_info[key])
        })
        return res.status(403).redirect(`/edit-address/${req.session.userId}`);
       }

        const updated_address = {
            user_id: req.session.userId,
            name: title,
            house_name: name,
            state: state,
            country: country,
            pincode: pincode,
            landmark: landmark,
        }

       const update_address = await Address.updateOne({_id:id},{$set:updated_address});

       if(update_address){
            return res.status(200).redirect(`/address/${req.session.userId}`);
       }else{
         req.flash("errUpdatingAddress","Error updating address, try again")
            return res.status(403).redirect(`/edit-address/${id}`)
       }

    } catch (error) {
        console.error("error editing address",error)
        throw new Error("error editing address",error)
    }
}

const change_password = async (req, res) => {

    const id = req.params.id;
    const user = await User.findById({_id:id})
    const user_password = user.password;

    const { currentPass, newPass, confirmNewPass } = req.body;

    if(!currentPass || !newPass || !confirmNewPass){
        req.flash("missingField","missing details, try again");
        return res.status(403).redirect(`/security/${id}`)
    } 

    const check_current_password = await bcrypt.compare(currentPass, user_password);
    if(check_current_password){

        const check_passwords = profileValidator.password_validator(req.body);
        if(Object.keys(check_passwords).length > 0){
            Object.keys(check_passwords).forEach(key => {
                req.flash("invalidFormat", check_passwords[key])
            })
            return res.status(403).redirect(`/security/${id}`);
        }

            if(newPass === confirmNewPass){

                const new_password = await bcrypt.hash(newPass, 10);
                const update_password = await User.updateOne({_id:id},{$set:{password:new_password}});

                if(update_password){

                    req.session.userAuth = false;
                    delete req.session.userId;
                    delete req.session.username;

                    return res.status(200).redirect('/user_login');

                }else{
                    req.flash("errUpdatingPassword","couldn't update password retry.")
                    return res.status(402).redirect(`/security/${id}`)
                }
            }else{
                req.flash("invalidNewPassword","new password and confim password should be same !");
                return res.status(403).redirect(`/security/${id}`)
            }
    }else{
        req.flash("invalidCurrentPassword","invalid password");
        return res.status(403).redirect(`/security/${id}`);
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
    get_orders,
    add_wallet,
    add_address,
    edit_address,
    delete_address,
    change_password
}