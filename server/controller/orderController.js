const get_orders = async (req,res) => {
    try {
        res.render('admin/orders');
    } catch (error) {
        console.error("error rendering orders", error);
    }
}

module.exports = {
    get_orders
}