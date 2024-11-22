import { Router } from "express";

const cookiesRouter = Router();

cookiesRouter.get("/create", (req, res, next)=>{
    try {
        const message = "COOKIE SETEADA"
        return res.status(201)
        .cookie("modo","oscuro")
        .cookie("rolDeUsuario", "admin")
        .json({message})
    } catch (error) {
        return(next(error))
    }
})

cookiesRouter.get("/read", (req,res, next)=>{
    try {
        const cookies = req.cookies;
        console.log(cookies)
        const message = "COOKIE LEIDA"
        return res.status(200).json({message})
    } catch (error) {
        return(next(error))
    }
})

cookiesRouter.get("/destroy/:cookieABorrar", (req, res, next)=>{
    try {
        const { cookieABorrar } = req.params
        const message = "COOKIE ELIMINADA"
        return res.status(200).clearCookie(cookieABorrar).json({message})
    } catch (error) {
        return(next(error))
    }
})

cookiesRouter.get("/signed", (req, res, next)=>{
    try {
        const message = "COOKIE FIRMADA CREADA"
        return res.status(201).cookie("nombre", "ariel", {signed: true}).json({message})
    } catch (error) {
        return(next(error))
    }
})

cookiesRouter.get("/read-signed", (req, res, next)=>{
try {
    const cookies = req.cookies
    const signedCookies = req.signedCookies
    res.status(200).json({cookies, signedCookies})
} catch (error) {
    return(next(error))
}
})

export default cookiesRouter