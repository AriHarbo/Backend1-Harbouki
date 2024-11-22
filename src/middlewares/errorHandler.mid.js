function errorHandler(error,req,res,next){
    const message = error.message || `${req.method} ${req.url} - API ERROR`
    const statusCode = error.statusCode || 500

    return res.status(statusCode).json({message})
}

export default errorHandler