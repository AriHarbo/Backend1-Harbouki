import { UserManagerDB } from "../dao/mongo/UserMaganerDB.js";

async function isVerifyPassword(req,res,next) {
    try {
        const { email, password} = req.body;
        const message = "INVALID CREDENTIALS"
        const one = await UserManagerDB.getUserByEmail(email)
        if(!one) {
            return res.status(400).json({message})
        }
        const verify = password === one.password
        if(verify){
            return next()
        }
        else{
            
            return res.status(401).json({message})
        }
    } catch (error) {
        return next(error)
    }
}

export default isVerifyPassword