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

    static async updateCarrito(id, carrito){
        return await carritoModelo.updateOne({_id: id}, carrito, {new:true})
    }
}

module.exports = CartManagerDB;