const { Router } = require("express");
const CartManagerDB = require('../dao/CartManagerDB.js');
const ProductManagerDB = require('../dao/ProductManagerDB.js');
const mongoose = require("mongoose");
const { isValidObjectId }  = require("mongoose");
const { carritoModelo } = require("../dao/models/carrito.model.js");
const { productosModelo} = require("../dao/models/productos.model.js");

const router = Router();

// POST / -> crear un nuevo carrito
router.post('/', async (req, res) => {
    try{
        const newCart = await CartManagerDB.createCarrito();
        res.setHeader('Content-Type','application/json')
        res.status(201).json({newCart});
    }
    catch(error){
        res.setHeader('Content-Type','application/json')
        res.status(500).json({message: 'Error al crear el carrito'});
    }
});

// GET / -> obtener todos los carritos
// Esto para poder observar cual id es para cada carrito, ya que son las generadas por Atlas
router.get('/', async (req, res) => {
    try{
        let carts = await CartManagerDB.getCarts();
        res.setHeader('Content-Type','application/json')
        res.status(200).json(carts);
    }
    catch(error){
        res.setHeader('Content-Type','application/json')
        res.status(500).json({message: 'Error al obtener los carritos'});
    }

})

// GET /:cid -> obtener los productos de un carrito
router.get('/:cid', async (req, res) => {
    let {cid} = req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json')
        res.status(400).json({message: 'El id del carrito no es válido'})
    }
    

    try{ 
        const carrito = await CartManagerDB.getById({ _id: cid })
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error:`No existen carritos con id ${cid}`})
        }
        let carritoConProductos = await carrito.populate("productos.id")
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({carrito});
    }
    catch{
        res.status(404).send('Carrito no encontrado');
    } 
        
});

// POST /:cid/product/:pid -> agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    let {cid, pid}=req.params
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`id invalido...`})
    }
    try {
        let carrito = await CartManagerDB.getById(cid)
        console.log("hola")
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe carrito con id ${cid}`})
        }
        let producto = ProductManagerDB.getProductoBy({_id: pid})
        if(!producto){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe producto con id ${pid}`})
        }

        let indiceProducto=carrito.productos.findIndex(p=>p.id==pid)
        if(indiceProducto===-1){
            carrito.productos.push({
                id: pid, cantidad: 1
            })
        }else{
            carrito.productos[indiceProducto].cantidad ++
        }

        let carritoActualizado=await CartManagerDB.updateCarrito(cid, carrito)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({carritoActualizado});

    } catch (error) {
        res.status(404).send(error.message);
    }
});

// DELETE /:cid/product/:pid -> eliminar un producto del carrito

router.delete('/:cid/product/:pid', async (req, res) => {
    let { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `id invalido...` });
    }

    try {
        let carrito = await CartManagerDB.getById(cid);
        if (!carrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe carrito con id ${cid}` });
        }

        let producto = await ProductManagerDB.getProductoBy({ _id: pid });
        if (!producto) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe producto con id ${pid}` });
        }

        console.log('Carrito sin eliminar nada: ', carrito);

        // Eliminar el producto del carrito si el id coincide con el pid
        carrito.productos = carrito.productos.filter(prod => prod.id !== pid);

        console.log('Carrito con el producto eliminado: ', carrito);

        let carritoActualizado = await CartManagerDB.updateCarrito(cid, carrito);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carritoActualizado });

    } catch (error) {
        res.status(404).send(error.message);
    }
});

// DELETE eliminar todos los productos de un carrito
router.delete('/:cid', async (req, res) => {
    let {cid} = req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json')
        res.status(400).json({message: 'El id del carrito no es válido'})
    }
    try{
        carritoVacio = []
        let carrito = await CartManagerDB.getById(cid)
        carrito.productos = carritoVacio;
        let carritoActualizado = await CartManagerDB.updateCarrito(cid, carrito);
        res.setHeader('Content-Type','application/json')
        res.status(200).json({carritoActualizado})

    }
    catch(error){
        res.status(404).send(error.message)
    }
})

// PUT /:cid actualizar el carrito con un arreglo de productos
// IMPORTANTE: Recibe un arreglo de productos y sobreescribe el arreglo que haya en el carrito

router.put("/:cid", async (req, res) => {
    let {cid} = req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json')
        res.status(400).json({message: 'El id del carrito no es válido'})
    }
    try{
        nuevosProductos = await req.body.productos;
        let carrito = await CartManagerDB.getById(cid)
        if(!carrito){
            res.setHeader('Content-Type','application/json') 
            res.status(400).json({message: `No existe carrito con id ${cid}`})
        }
        carrito.productos = nuevosProductos;
        let carritoActualizado = await CartManagerDB.updateCarrito(cid, carrito);
        res.setHeader('Content-Type','application/json')
        res.status(200).json({carritoActualizado})
    }
    catch(error){
        res.status(404).send(error.message);
    }
})

// PUT /:cid/products/:pid para actualizar SOLO la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `id invalido...` });
    }
    try{
        nuevaCantidad = await req.body.cantidad;
        let carrito = await CartManagerDB.getById(cid);
        if (!carrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe carrito con id ${cid}` });
        }

        let productoEnCarrito = carrito.productos.find(p => p.id === pid);
        if (!productoEnCarrito) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe producto con id ${pid}` });
        }
        productoEnCarrito.cantidad = nuevaCantidad;
        let carritoActualizado = await CartManagerDB.updateCarrito(cid, carrito);
        res.setHeader('Content-Type','application/json')
        res.status(200).json({carritoActualizado})
    }
    catch(error){
        res.status(404).send(error.message);
    }
})


module.exports = router;
