import { carritoModelo } from '../models/carrito.model.js'

export class CartManagerDB {

    static async getCarts(){
        return carritoModelo.find().lean()
    }

    static async createCarrito(){
        const carritoNuevo = await carritoModelo.create({productos:[]})
        return carritoNuevo.toJSON()
    }

    static async getById(id){
        return carritoModelo.findOne({_id: id})
    }

    static async updateCarrito(id, aModificar){
        return await carritoModelo.findByIdAndUpdate(id, aModificar, {new:true}).lean()
    }
}