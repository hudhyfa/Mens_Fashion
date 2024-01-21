const errorHandlerMiddleware = (err, req, res, next) => {
    console.error("error handler middleware:",err.message,err.stack);
    res.status(500).render('user/error',{errMsg:err.message});
}

module.exports = errorHandlerMiddleware;