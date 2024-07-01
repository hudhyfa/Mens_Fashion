const User = require('../modal/user');
const Product = require('../modal/product');
const Order = require('../modal/order');
const easyinvoice = require('easyinvoice');

const adminValidator = require('../../utils/user_validator')
const bcrypt = require('bcryptjs');
const excelJs = require('exceljs');

const admin_dashboard = async (req, res) => {
    try {

        const [productCount, orderCount, userCount] = await Promise.all([
            Product.countDocuments(),
            Order.countDocuments(),
            User.countDocuments()
        ])

        const sales = await Order.aggregate([
            {
                $match:{
                    status:{
                        $nin: ["returned","cancelled"]
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    totalAmount:{
                        $sum: "$total_amount"
                    }
                }
            }
        ])
        const totalSales = sales[0].totalAmount;

        const sideBox = {
            totalSales,
            productCount,
            userCount,
            orderCount
        }


        const salesGraph = await Order.aggregate([
            {
                $group:{
                   _id:{
                        year:{
                            $year: "$created_at"
                        },
                    },
                    count:{
                        $sum: 1
                    }
                }
            }
        ])

        if(req.body.getGraph){
            return res.json({
                salesGraph: salesGraph
            })
        }else{
            return res.render('admin/dashboard',{sideBox:sideBox,salesGraph:salesGraph})
        }


    } catch (error) {
        console.error("Error rendering admin dashboard",error);
    }
}

const create_report = async (req, res) => {
    try {
        const from = req.query.from;
        const to = req.query.to;
        const format = req.query.format;

        const fromDate = new Date(from); 
        const toDate = new Date(to);   

        const report = await Order.aggregate([
            {
                $match: {
                    created_at: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $unwind: "$products"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products.product_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: {
                        productId: "$products.product_id",
                        productName: "$productDetails.name",
                        productPrice: "$productDetails.price"
                    },
                    quantitySold: { $sum: "$products.quantity" },
                    productTotal: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    productName: "$_id.productName",
                    quantitySold: 1,
                    productTotal: 1
                }
            },
            {
                $group: {
                    _id: null,
                    products: { $push: "$$ROOT" },
                    totalProductTotals: { $sum: "$productTotal" }
                }
            },
            {
                $project: {
                    _id: 0,
                    products: 1,
                    totalProductTotals: 1
                }
            }
        ]);
        
        console.log(report);

        const products = report[0].products;

        products.forEach(product => {
            const productName = product.productName;
            const quantitySold = product.quantitySold;
            const productTotal = product.productTotal;

            console.log(`Product: ${productName}, Quantity Sold: ${quantitySold}, Total Amount: ${productTotal}`);
        });
        
        if(format === "pdf"){
            const pdfBuffer = await generateInvoice(report);
    
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${new Date()}.pdf`);
            res.send(pdfBuffer);
        }else{
            let totalAmount = report[0].totalProductTotals;
            let allProducts = report[0].products;

            let workbook = new excelJs.Workbook();
            
            const sheet = workbook.addWorksheet("Sales Report");
            sheet.columns = [
                {header:"Product Name",key:"productName",width:25},
                {header:"Quantity",key:"productQuantity",width:10},
                {header:"Total",key:"productTotal",width:10},
                {header:"Total Sales",key:"totalSales",width:10}
            ]

            await allProducts.map((value,idx) => {
                sheet.addRow({
                    productName: value.productName,
                    productQuantity: value.quantitySold,
                    productTotal: value.productTotal
                })
            })

            sheet.addRow({
                totalSales: totalAmount
            })

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )

            res.setHeader(
                "Content-Disposition",
                "attachment;filename=" + "report.xlsx"
            )

            workbook.xlsx.write(res)
        }

        
    } catch (error) {
        console.log("error creating report", error)
    }
}

const generateInvoice=async (report)=>{
    try{
      let totalAmount = report[0].totalProductTotals;
      let allProducts = report[0].products;
      console.log("inside generate:",totalAmount,allProducts);
      const data = {
        currency: "INR",
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        sender: {
          company: "Men's Fashion",
          address: "123 Main Street, Banglore, India",
          zip: "651323",
          city: "Banglore",
          country: "INDIA",
          phone: "9876543210",
          email: "mensfashion@gmail.com",
          website: "www.mensfashion.shop",
        },
        invoiceNumber: `INV-${report[0]._id}`,
        invoiceDate: new Date().toJSON(),
        products: allProducts.map((product) => ({
            quantity: product.quantitySold,
            description: product.productName,
            price: product.productTotal
        })),
        tax:0,
        total: `$ ${totalAmount.toFixed(2)}`,
        bottomNotice: "Congrats !",
      };
      
    const result = await easyinvoice.createInvoice(data);
    const pdfBuffer = Buffer.from(result.pdf, "base64");
  
    return pdfBuffer;
  }catch(error){
      console.log(error);
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
    create_report
}