const Order = require('../modal/order');

const get_orders = async (req,res) => {
    try {
        let page = parseInt(req.body.currentPage) || 1;
        const limit = 4;
        const action = req.body.action;
        if(action){
            page+=action;
        }
        const skip = (page - 1) * limit;
        const orderCount = await Order.countDocuments();
        const totalPages = orderCount/limit;

        const orders = await Order.find()
            .populate({path:"user_id",select:["username"]})
            .sort({created_at:-1})
            .skip(skip)
            .limit(limit)
            

        if(req.body.currentPage){
            res.json({
                orders: orders,
                currentPage: page,
                totalPages: totalPages
            })
        }else{
            return res.render('admin/orders',{orders:orders,currentPage:page,totalPages:totalPages});
        }

    } catch (error) {
        console.error("error rendering orders", error);
    }
}

const update_status = async (req, res) => {
    try {
        const order_id = req.params.id;
        const new_status = req.params.status;

        await Order.updateOne({_id: order_id},{$set:{status:new_status}})

        res.status(200).redirect('/orders');
    } catch (error) {
        console.error("error updating order status", error);
    }
}

module.exports = {
    get_orders,
    update_status
}