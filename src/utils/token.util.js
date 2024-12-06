import jwt from "jsonwebtoken";


function createTokenUtil(data){
    const token = jwt.sign(data, process.env.SESSION_KEY, {expiresIn: 60 * 60 * 24 * 7})
    return token
}

function verifyTokenUtil(token){
    const verifyData = jwt.verify(token,process.env.SESSION_KEY)
    return verifyData
}

export {createTokenUtil, verifyTokenUtil}