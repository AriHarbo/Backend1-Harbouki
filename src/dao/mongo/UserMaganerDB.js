import User from '../models/user.model.js';

export class UserManagerDB {

    static async createUser(user={}){
        try {
            const nuevoUser = await User.create(user)
            return  nuevoUser;
        } catch (error) {
            throw error
        }
    }

    static async getUsers(){
        try {
            const usuarios = await User.find().lean()
            return usuarios
        } catch (error) {
            throw error
        }
    }

    static async getUserByEmail(email=""){
        try {
            return await User.findOne({email: email}).lean()
        } catch (error) {
            throw error
        }
    }
    static async getUserById(id){
        try {
            return await User.findOne({_id: id})
        } catch (error) {
            throw error
        }
    }

    static async updateUser(id, aModificar){
        try {
            return await User.findByIdAndUpdate(id, aModificar, {new: true}).lean()
        } catch (error) {
            throw error
        }
    }

    static async deleteUser(id){
        try {
            return await User.findByIdAndDelete(id).lean()
        } catch (error) {
            throw error
        }
    }
}