import { Router } from "express";
import { UserManagerDB } from "../../dao/mongo/UserMaganerDB.js";
import isValidUser from "../../middlewares/isValidUser.mid.js";
import requiredFields from "../../middlewares/requiredFields.mid.js";
import verifyUserExists from "../../middlewares/verifyUserExists.mid.js";
import createHash from "../../middlewares/createHash.mid.js";
import verifyHash from "../../middlewares/verifyHash.mid.js";
import passport from "../../middlewares/passport.mid.js"
import { verifyTokenUtil } from "../../utils/token.util.js";

const sessionsRouter = Router();

sessionsRouter.post("/register", passport.authenticate("register", {session: false}), register)

sessionsRouter.post("/login", passport.authenticate("login",{session: false}),login)

sessionsRouter.post("/singout", singout)

sessionsRouter.post("/online", onlineToken)

export default sessionsRouter;

async function register(req,res,next){
    try {
        const user = req.user
        const message = "USER REGISTERED"
        return res.status(201).json({message, response: user._id})
    } catch (error) {
        return next(error)
    }
}

async function login(req,res,next){
    try {
        const { token } = req.user
        const opts = { maxAge: 60*60*24*7, httpOnly: true }
        return res.status(200).cookie("token", token, opts).json({ message: "USER LOGGED IN" });
    } catch (error) {
        return next(error)
    }
}

function singout(req,res,next){
    try {
        return res
        .status(200)
        .clearCookie("token")
        .json({message: "USER SIGNED OUT" })
    } catch (error) {
        return next(error)
    }
}

async function online (req,res,next){
    try {
        const { user_id } = req.session
        const user = await UserManagerDB.getUserById(user_id)
        if(req.session.user_id){
            return res.status(200).json({ message: user.email.toUpperCase()+" IS ONLINE", online: true })
        }
        return res.status(400).json({message: "USER IS NOT ONLINE"})
    } catch (error) {
        return next(error)
    }
}

 async function onlineToken (req,res,next){
    try {
        const { token } = req.headers
        const data = verifyTokenUtil(token)
        const user = await UserManagerDB.getUserById(data.user_id)
        if(user){
            return res.status(200).json({ message: user.email.toUpperCase()+" IS ONLINE", online: true })
        }
        return res.status(400).json({message: "USER IS NOT ONLINE"})
    } catch (error) {
        return next(error)
    }
}

