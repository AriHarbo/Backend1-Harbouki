const express = require("express");
const router = express.Router();
const ProductManagerDB = require("../dao/ProductManagerDB.js");

router.get('/home', async (req, res) => {
    let {page, limit} = req.query

    let {docs:products, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage} = await ProductManagerDB.getProductos(page, limit); // Obtener productos

    res.render('home', { 
        products,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        page
    });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;