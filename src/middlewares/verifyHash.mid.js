import { UserManagerDB } from "../dao/mongo/UserMaganerDB.js";
import { verifyHashUtil } from "../utils/hash.util.js";

async function verifyHash(req, res, next){
    try {
        const { email, password } = req.body
        const user = await UserManagerDB.getUserByEmail(email)
        const dbPassword = user.password
        const verify = verifyHashUtil(password, dbPassword)
        if(verify){
            return next()
        }
        else{
            const error = new Error('INVALID CREDENTIAL')
            error.statusCode = 401
            throw error
        }
    } catch (error) {
        return next(error)
    }
}

export default verifyHash;