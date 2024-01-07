const Order = require('../modal/order');

const get_orders = async (req,res) => {
    try {
        const orders = await Order.find();
        res.render('admin/orders',{orders:orders});
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