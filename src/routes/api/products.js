import { Router } from "express"
import { ProductManagerDB } from "../../dao/mongo/ProductManagerDB.js"
import { isValidObjectId }  from "mongoose"
import passport from "../../middlewares/passport.mid.js"


export const  router=Router()


router.get('/', async (req, res) => {
    try{
        let {page, limit, sort, query, available}=req.query
        sort = sort === 'asc' || sort === 'desc' ? sort : null;
        query = query || null; // Si no hay query, será null
        available = available === 'true' ? true : available === 'false' ? false : null;

        const sortOption = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null;
        const filter = {};

        if (query) {
            filter.category = { $regex: query, $options: 'i' }; 
        }
    
        if (available !== null) {
            filter.stock = available ? { $gt: 0 } : { $lte: 0 }; 
        }

        let products = await ProductManagerDB.getProductos(page, limit,filter , sortOption);
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
        res.status(404).json({error:'Producto no encontrado'});
    }
});

router.post('/', passport.authenticate("admin", { session: false }) , async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({error:'Faltan campos obligatorios'});
    }

    try{
        let existe = await ProductManagerDB.getProductoByCode(code)
        if(existe){
            return res.status(400).json({error:'El producto ya existe'})
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

router.put('/:pid', passport.authenticate("admin", { session: false }) ,async (req, res) => {
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
        res.status(404).json({error: "Error al actualizar el producto"});
    }
});

router.delete('/:pid', passport.authenticate("admin", { session: false }) ,async (req, res) => {
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
        res.status(404).json({error: "No se pudo eliminar el producto"});
    }
});
