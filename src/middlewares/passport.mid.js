import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserManagerDB } from "../dao/mongo/UserMaganerDB.js";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";

passport.use("register", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
        try {
            const one = await UserManagerDB.getUserByEmail(req.body.email)
            if (one) {
                const error = new Error("User alredy exists");
                error.statusCode = 400
                return done(error)
            }
            req.body.password = createHashUtil(password)
            const data = req.body;
            const user = await UserManagerDB.createUser(data)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
))
passport.use("login", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
        try {
            const one = await UserManagerDB.getUserByEmail(email)
            if(!one){
                const error = new Error('INVALID CREDENTIAL')
                error.statusCode = 401
                return done(error)
            }
            const dbPassword = one.password
            const verify = verifyHashUtil(password, dbPassword)
            if(!verify){
                const error = new Error('INVALID CREDENTIAL')
                error.statusCode = 401
                return done(error)
            }
            req.session.online = true
            req.session.role = one.role
            req.session.user_id = one._id
            return done(null, one)
        } catch (error) {
            return done(error)
        }
    }
))

export default passport;