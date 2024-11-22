import express from 'express'
import { engine } from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';


import {router as productsRouter} from './routes/api/products.js'
import {router as cartsRouter} from'./routes/api/carts.js'
import {router as viewsRouter} from './routes/views/viewsRouter.js'
import cookiesRouter from './routes/api/cookies.js'
import pathHandler from './middlewares/pathHandler.mid.js'
import errorHandler from './middlewares/errorHandler.mid.js'
import morgan from 'morgan'

dotenv.config();

// Sevidor
const port = process.env.PORT;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);



// handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middlewares anteriores a las rutas
app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser(process.env.SECRET_KEY))


// Rutas 
// Vistas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/cookies', cookiesRouter)
// Middlewares posteriores a las rutas
app.use(pathHandler) // Ultimo middleware

app.use(errorHandler) // Manejador de errores

httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto: ${port}`);
});


// Conectar con la DB
const conectarDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_LINK,
            {
                dbName: 'ecommerce',
            }
        );
        console.log('DB Online...');
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

conectarDB();


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

