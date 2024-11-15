const { Router } = require("express");
const CartManagerDB = require('../dao/CartManagerDB.js');
const ProductManagerDB = require('../dao/ProductManagerDB.js');
const { isValidObjectId }  = require("mongoose");
const { carritoModelo } = require("../dao/models/carrito.model.js");

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

// GET /:cid -> obtener los productos de un carrito
router.get('/:cid', async (req, res) => {
    let {cid} = req.params
    if(!isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json')
        res.status(400).json({message: 'El id del carrito no es válido'})
    }

    try{ 
        let carrito = await CartManagerDB.getById(cid);
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error:`No existen carritos con id ${cid}`})
        }
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

module.exports = router;
