const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/ProductManager");

router.get('/home', async (req, res) => {
    const products = await ProductManager.getProducts(); // Obtener productos
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;