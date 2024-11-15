const express = require("express")
const {engine} = require("express-handlebars")
const http = require("http")
const { Server } = require("socket.io")
const ProductManager =  require("./dao/ProductManager")
const mongoose = require("mongoose")



const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/viewsRouter');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")


// Vistas
app.use('/', viewsRouter)

// Sevidor
const PORT = 8080;

httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
})

// Conectar con la DB

const conectarDB = async()=>{
    try{
        await mongoose.connect(
            "mongodb+srv://arielharbo219:Y7yeFZSYgWfwvg6a@cluster0.vpzhz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            {
                dbName: "ecommerce"
            }
        )
        console.log("DB Online...")
    }
    catch(error){
        console.log(`Error: ${error.message}`)
    }
}

conectarDB()

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

