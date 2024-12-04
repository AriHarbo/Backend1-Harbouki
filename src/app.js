import express from 'express'
import { engine } from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cookieParser from "cookie-parser"
import session from "express-session"
import sessionFileStore from "session-file-store"
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv';


import {router as productsRouter} from './routes/api/products.js'
import {router as cartsRouter} from'./routes/api/carts.js'
import {router as viewsRouter} from './routes/views/viewsRouter.js'
import cookiesRouter from './routes/api/cookies.js'
import pathHandler from './middlewares/pathHandler.mid.js'
import errorHandler from './middlewares/errorHandler.mid.js'
import morgan from 'morgan'
import sessionsRouter from './routes/api/sessions.js'

dotenv.config();

// Sevidor
const port = process.env.PORT;
const app = express();
const httpServer = http.createServer(app);

// Conectar con la DB
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_LINK);
        console.log('DB Online...');
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

conectarDB();

httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto: ${port}`);
});


// handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middlewares anteriores a las rutas
app.use(express.json());
app.use(express.static('public'));
app.use(morgan("dev"))
app.use(cookieParser(process.env.SECRET_KEY)) // CONFIGURACION COOKIES
// CONFIGURACION MEMORY SESSION
// app.use(session({secret: process.env.SESSION_KEY, resave: true, saveUninitialized: true, cookie: {maxAge: 60000}, }))
// CONFIGURACION MONGO STORAGE
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_LINK,
        ttl: 60 * 60 * 24 // 24 hours
    })
}));

// Rutas 
// Vistas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/cookies', cookiesRouter)
app.use('/api/sessions', sessionsRouter)


// Middlewares posteriores a las rutas
app.use(errorHandler) // Manejador de errores
app.use(pathHandler) // Ultimo middleware


/* WEB SOCKET CON FILESYSTEM

io.on("connection", async (socket)=>{
    console.log("Nueva conexion")

    const products = await ProductManager.getProducts();
    socket.emit("products", products);

    socket.on("newProduct", async (productData) => {
        await ProductManager.addProduct(productData);
        const updatedProducts = await ProductManager.getProducts();
        io.emit("products", updatedProducts);
    })

    socket.on("deleteProduct", async (productId) => {
        await ProductManager.deleteProduct(productId);
        const updatedProducts = await ProductManager.getProducts();
        io.emit("products", updatedProducts);
    })
})

*/

