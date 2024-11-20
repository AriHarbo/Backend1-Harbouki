import { productosModelo } from './models/productos.model.js'

 export class ProductManagerDB{

    static async getProductos(page=1, limit=10, filter = {}, sort = null){
        const options = {
            page,
            limit,
            lean: true,
        };
    
        if (sort) {
            options.sort = { price: sort }; 
        }
    
        return await productosModelo.paginate(filter, options);
    }

    static async getProductoBy(filtro={}){
        return await productosModelo.findOne(filtro).lean()
    }

    static async getProductoByCode(code=""){
        return await productosModelo.findOne({code:code}).lean()
    }

    static async createProducto(producto={}){
        let nuevoProducto = await productosModelo.create(producto)
        return nuevoProducto.toJSON()
    }

    static async updateProducto(id, aModificar){
        return await productosModelo.findByIdAndUpdate(id, aModificar, {new: true}).lean()
    }

    static async deleteProducto(id){
        return await productosModelo.findByIdAndDelete(id).lean()
    }
}