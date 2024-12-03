import { UserManagerDB } from "../dao/mongo/UserMaganerDB.js";

async function verifyUserExists(req,res,next){
    try {
        const user =await UserManagerDB.getUserByEmail(req.body.email)
        if(user){
            return res.status(400).json({message: "El usuario ya existe"})
        }
        return next()
    } catch (error) {
        return next(error)
    }
}

export default verifyUserExists;