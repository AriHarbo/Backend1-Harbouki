import { Router } from "express";
import { UserManagerDB } from "../../dao/mongo/UserMaganerDB.js";
import isVerifyPassword from "../../middlewares/isVerifyPassword.mid.js";
import requiredFields from "../../middlewares/requiredFields.mid.js";
import verifyUserExists from "../../middlewares/verifyUserExists.mid.js";

const sessionsRouter = Router();

sessionsRouter.post("/register",
    requiredFields,
    verifyUserExists, 
    async(req,res,next)=>{
    const data = req.body;

    try {
        
        const newUser = await UserManagerDB.createUser(data)
        const message = "USER REGISTERED"
        return res.status(201).json({message, newUser})
    } catch (error) {
        return next(error)
    }
})

sessionsRouter.post("/login",
    isVerifyPassword, 
    (req,res,next)=>{
    try {
        req.session.online = true
        req.session.email = req.body.email
        const message = "USER LOGGED"
        return res.status(200).json({message})
    } catch (error) {
        return next(error)
    }
})

sessionsRouter.post("/singout", async(req,res,next)=>{
    try {
        const sessions = req.session
        req.session.destroy()
        return res.status(200).json({message: "USER SIGNED OUT", sessions })
    } catch (error) {
        return next(error)
    }
})

sessionsRouter.post("/online", (req,res,next)=>{
    try {
        const sessions = req.session
        if(sessions.online){
            return res.status(200).json({ message: "USER IS ONLINE", sessions })
        }
        return res.status(400).json({message: "INVALID CREDENTIALS"})
    } catch (error) {
        return next(error)
    }
})

export default sessionsRouter;