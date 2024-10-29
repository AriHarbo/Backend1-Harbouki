const { Router } = require("express");
const CartManager = require('../dao/CartManager.js');
const ProductManager = require('../dao/ProductManager.js');

const router = Router();

// Establecemos la ruta del archivo
CartManager.setPath('./src/data/carts.json');
ProductManager.setPath("./src/data/products.json");
// POST / -> crear un nuevo carrito
router.post('/', async (req, res) => {
    try{
        const newCart = await CartManager.createCart();
        res.status(201).json(newCart);
    }
    catch(error){
        res.status(500).json({message: 'Error al crear el carrito'});
    }
});

// GET /:cid -> obtener los productos de un carrito
router.get('/:cid', async (req, res) => {
    let {cid} = req.params
    cid = Number(cid)
    if(isNaN(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`id debe ser numérico`})
    }
    try{ 
        let carrito = await CartManager.getCartById(id);
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
    let {cid} = req.params;
    cid =  Number(cid);
    let {pid} = req.params;
    pid =   Number(pid);
    let producto = await ProductManager.getProductById(pid)
    if(!producto){
        pid = -1
    }
    try {
        const updatedCart = await CartManager.addProductToCart(cid,pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

module.exports = router;
