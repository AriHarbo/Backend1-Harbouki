const { productosModelo } = require('./models/productos.model.js');

 class ProductManagerDB{

    static async getProductos(){
        return await productosModelo.find().lean()
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

module.exports = ProductManagerDB;