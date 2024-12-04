import { UserManagerDB } from "../dao/mongo/UserMaganerDB.js";

async function isValidUser(req, res, next) {
    try {
        const { email } = req.body;
        const one = await UserManagerDB.getUserByEmail(email)
        if (one) {
            return next()
        }
        const error = new Error('INVALID CREDENTIAL')
        error.statusCode = 401
        throw error
    } catch (error) {
        return next(error)
    }
}

export default isValidUser