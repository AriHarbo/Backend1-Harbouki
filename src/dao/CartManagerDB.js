const { carritoModelo } = require('./models/carrito.model.js');

class CartManagerDB {

    static async getCarts(){
        return carritoModelo.find().lean()
    }

    static async createCarrito(){
        let carritoNuevo = await carritoModelo.create({productos:[]})
        return carritoNuevo.toJSON()
    }

    static async getById(id){
        return carritoModelo.findOne({_id: id})
    }

    static async updateCarrito(id, aModificar){
        return await carritoModelo.findByIdAndUpdate(id, aModificar, {new:true}).lean()
    }
}

module.exports = CartManagerDB;