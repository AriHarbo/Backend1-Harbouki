const { Router } = require("express");
const CartManager = require('../dao/CartManager.js');

const router = Router();

// Establecemos la ruta del archivo
CartManager.setPath('./data/carts.json');

// POST / -> crear un nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await CartManager.createCart();
    res.status(201).json(newCart);
});

// GET /:cid -> obtener los productos de un carrito
router.get('/:cid', async (req, res) => {
    const cart = await CartManager.getCartById(req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

// POST /:cid/product/:pid -> agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

module.exports = router;
