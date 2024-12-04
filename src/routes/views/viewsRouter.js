import express from "express"
import {ProductManagerDB} from "../../dao/mongo/ProductManagerDB.js"
import { isValidObjectId }  from "mongoose"

export const router = express.Router();

router.get('/home', async (req, res) => {
    let { page, limit, sort, query, available } = req.query;

    limit = limit ? parseInt(limit) : 10; // Valor predeterminado: 10
    page = page ? parseInt(page) : 1; // Valor predeterminado: 1
    sort = sort === 'asc' || sort === 'desc' ? sort : null; // Asegurarse de que sea válido
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

    let {docs:products, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage} = await ProductManagerDB.getProductos(page, limit, filter, sortOption); // Obtener productos

    const queryParams = {
        limit,
        sort,
        query,
        available: available !== null ? available : '',
    };

    res.render('home', { 
        products,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        page,
        queryParams
    });
    
  
});

router.get('/realtimeproducts',  (req, res) => {
    res.render('realTimeProducts');
});

router.get('/product/:pid', async  (req, res) =>{
    const { pid } = req.params;
    const producto =  await ProductManagerDB.getProductoBy({ _id: pid });
    
    if(!isValidObjectId(pid)){
        res.setHeader('Content-Type','application/json')
        res.status(400).json({message: 'El id del producto no es válido'})
    }
    if (!producto) {
        return res.status(404).json({error:"Producto no encontrado"});
    }
     try {
        res.render('productView', {
            producto
        });
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({error:"Error interno del servidor"});
    }
})

router.get('/register', async (req, res)=>{
    res.render('register')
})
router.get('/login', async (req, res)=>{
    res.render('login')
})