import express from 'express'
import path from 'path'
import { engine } from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'
import {ProductManager} from './dao/ProductManager.js'
import mongoose from 'mongoose'


import {router as productsRouter} from './routes/products.js'
import {router as cartsRouter} from'./routes/carts.js'
import {router as viewsRouter} from './routes/viewsRouter.js'

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
app.use(express.json());
// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Vistas
app.use('/', viewsRouter);

// Sevidor
const port = 8080;
httpServer.listen(port, () => {
    console.log(`Servidor escuchando en el puerto: ${port}`);
});


// Conectar con la DB
const conectarDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://arielharbo219:Y7yeFZSYgWfwvg6a@cluster0.vpzhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
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

