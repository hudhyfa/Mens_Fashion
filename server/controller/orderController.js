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

        async function filterOrders(status){
            try {
                return await Order.find({status: status})
                .populate({path:"user_id",select:["username"]})
                .sort({created_at:-1})
                .skip(skip)
                .limit(limit)
            } catch (error) {
                console.log("error while filtering orders", error);
            }
        }

        async function calculateTotalPage(status){
            try {
                const totalCount = await Order.find({status:status}).countDocuments();
                const totalPage = totalCount/limit;
                return totalPage
            } catch (error) {
                console.log("error while counting orders",error);
            }
        }

        if(req.body.currentPage && req.body.filterBy){
            const orders = await filterOrders(req.body.filterBy);
            const totalPage = await calculateTotalPage(orders);
            return res.json({
                orders: orders,
                currentPage: page,
                totalPages: totalPage
            })
        }else{
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

const search_order = async (req, res) => {
    try {
      const order_id = req.body.orderId;
      const order = await Order.find({_id: order_id});
      if(order){
        return res.json({
            sucess:true,
            orders:order
        })
      }else{
        return res.json({
            success:false
        })
      }
    } catch (error) {
       console.log("error searching orders", error); 
    }
}

module.exports = {
    get_orders,
    update_status,
    search_order
}