function requiredFields(req,res,next){
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({error: 'Faltan campos obligatorios.'})
        }
        else{
            return next()
        }
    } catch (error) {
        return next(error)
    }
}

export default requiredFields;