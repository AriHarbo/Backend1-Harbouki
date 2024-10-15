const { Router } = require("express");
const ProductManager = require('../dao/ProductManager.js');

const  router=Router()

ProductManager.setPath("./src/data/products.json");

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await ProductManager.getProducts();
    res.json(limit ? products.slice(0, limit) : products);
});

router.get('/:pid', async (req, res) => {
    const product = await ProductManager.getProductById(req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    const newProduct = await ProductManager.addProduct({
        title, description, code, price, stock, category, thumbnails
    });

    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await ProductManager.updateProduct(req.params.pid, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        await ProductManager.deleteProduct(req.params.pid);
        res.send('Producto eliminado');
    } catch (error) {
        res.status(404).send(error.message);
    }
});

module.exports = router;