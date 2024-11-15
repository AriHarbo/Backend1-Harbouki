const { Router } = require("express");
const ProductManagerDB = require('../dao/ProductManagerDB.js');
const { isValidObjectId }  = require("mongoose");


const  router=Router()


router.get('/', async (req, res) => {
    try{
        let {page, limit}=req.query

        let products = await ProductManagerDB.getProductos(page, limit);
        products={
            products:products.docs, 
            ...products   // spread
        }
        delete products.docs

        res.setHeader('Content-Type','application/json');
        res.status(200).json(products)
    }
    catch(error){
        res.setHeader('Content-Type','application/json');
        console.log(`Error: ${error.message}`);
    }
});

router.get('/:id', async (req, res) => {
    let {id} = req.params
    id = id.trim();
    if(!isValidObjectId(id)){
        return res.status(400).json({error: "id invalido"})
    }
    try{
        let producto = await ProductManagerDB.getProductoBy({_id: id})
        if(!producto){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error:`No existen productos con id ${id}`})
        }
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({producto});
    } catch{
        res.setHeader('Content-Type','application/json');
        res.status(404).send('Producto no encontrado');
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('Faltan campos obligatorios');
    }

    try{
        let existe = await ProductManagerDB.getProductoByCode(code)
        if(existe){
            return res.status(400).send('El producto ya existe')
        }

        const newProduct = await ProductManagerDB.createProducto({
            title, description, code, price, stock, category, thumbnails
        });
        res.setHeader('Content-Type','application/json');
        res.status(201).json(newProduct);
    }
    catch(error){
        res.setHeader('Content-Type','application/json');
        console.log(`Error: ${error.message}`)
    }
   
});

router.put('/:pid', async (req, res) => {
    let {pid} = req.params
    pid = pid.trim();
    if(!isValidObjectId(pid)){
        return res.status(400).json({error: "id invalido"})
    }

    let aModificar = req.body
    try {
        const updatedProduct = await ProductManagerDB.updateProducto(pid, aModificar);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({updatedProduct});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        res.status(404).send(error.message);
    }
});

router.delete('/:pid', async (req, res) => {
    let {pid} = req.params
    pid = pid.trim();
    if(!isValidObjectId(pid)){
        return res.status(400).json({error: "id invalido"})
    }
    try {
        let productoEliminado = await ProductManagerDB.deleteProducto(pid);
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({productoEliminado});
    } catch (error) {
        res.status(404).send(error.message);
    }
});

module.exports = router;