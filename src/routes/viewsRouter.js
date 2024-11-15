const express = require("express");
const router = express.Router();
const ProductManagerDB = require("../dao/ProductManagerDB.js");

router.get('/home', async (req, res) => {
    const products = await ProductManagerDB.getProductos(); // Obtener productos
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;