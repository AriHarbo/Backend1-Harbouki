import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserManagerDB } from "../dao/mongo/UserMaganerDB.js";
import { createHashUtil, verifyHashUtil } from "../utils/hash.util.js";
import { createTokenUtil, verifyTokenUtil } from "../utils/token.util.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from 'dotenv';
dotenv.config();

passport.use("register", new LocalStrategy(
    { passReqToCallback: true, usernameField: "email", passwordField: "password" },
    async (req, email, password, done) => {
        try {
            const one = await UserManagerDB.getUserByEmail(email)
            if (one) {
                const error = new Error("User alredy exists");
                error.statusCode = 400
                return done(error)
            }
            const hashedPassword= createHashUtil(password)
            const user = await UserManagerDB.createUser({
                email,
                password: hashedPassword,
                name: req.body.name || "Default Name",
                role: req.body.role
            })
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
))
passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserManagerDB.getUserByEmail(email);
          if (!user) {
            // const error = new Error("USER NOT FOUND");
            // error.statusCode = 401;
            // return done(error);
            const info = { message: "USER NOT FOUND", statusCode: 401 };
            return done(null, false, info);
          }
          const passwordForm = password; /* req.body.password */
          const passwordDb = user.password;
          const verify = verifyHashUtil(passwordForm, passwordDb);
          if (!verify) {
            // const error = new Error("INVALID CREDENTIALS");
            // error.statusCode = 401;
            // return done(error);
            const info = { message: "INVALID CREDENTIALS", statusCode: 401 };
            return done(null, false, info);
          }
          const data = {
            user_id: user._id,
            role: user.role,
          };
          const token = createTokenUtil(data);
          user.token = token;
          await UserManagerDB.updateUser(user._id, { isOnline: true });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

passport.use("admin", new JwtStrategy(
    { jwtFromRequest: ExtractJwt.fromExtractors([(req)=>req?.cookies?.token]), secretOrKey: process.env.SECRET_KEY },
     async (data, done) => {
        try {
            const { role, user_id } = data
            if(role !== "ADMIN"){
                const error = new Error('NOT AUTHORIZED')
                error.statusCode = 403
                return done(error)
            }
            const user = await UserManagerDB.getUserById(user_id)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
))

passport.use("online", new JwtStrategy(
        {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
        secretOrKey: process.env.SECRET_KEY,
      },
    async (req, done)=>{
        try {
            const { user_id } = data
            const user = await UserManagerDB.getUserById(user_id)
            const { isOnline } = user
            if(!isOnline){
                const error = new Error('USER IS NOT ONLINE')
                error.statusCode = 401
                return done(error)
            }
            return done(null,user)
        } catch (error) {
            return done(error)
        }
    }
))

passport.use("singout", new JwtStrategy(
    { jwtFromRequest: ExtractJwt.fromExtractors([(req)=>req?.cookies?.token]), secretOrKey: process.env.SECRET_KEY },
    async (req, done)=>{
        try {
            const { user_id } = data
            if (!user_id) {
                const error = new Error('Invalid token');
                error.statusCode = 400;
                return done(error);
            }
            await UserManagerDB.updateUser(user_id, {isOnline: false})
            
            const expiredToken = createTokenUtil({ user_id: null }, { expiresIn: '1s' }); // Token con expiración inmediata

            return done(null, { token: expiredToken});
        } catch (error) {
            return done(error)
        } 
    }
))

export default passport;