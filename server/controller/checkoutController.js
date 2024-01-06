const get_checkout = async (req,res) => {
    try {
        res.render('user/checkout');
    } catch (error) {
        console.error("error while rendering checkout page",error);
    }
}

module.exports = {
    get_checkout
}