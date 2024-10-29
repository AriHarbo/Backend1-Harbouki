 const fs = require("fs");

class CartManager {
    static #path = '';

    static setPath(filePath = ""){
        this.#path = filePath;
    }

    static async getCarts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, 'utf-8')); 
        }
            return [];
    }

    static async #saveFile(data = ''){
        if(typeof data !== "string"){
            throw new Error("Error en savefile: formato de datos invalido")
        }

        await fs.promises.writeFile(this.#path, data);
    }

    static async createCart(){
        let carts = await this.getCarts();
        let id = 1;

        if (carts.length > 0) {
            id = Math.max(...carts.map(c => c.id)) + 1;
        }

        let newCart ={
            id,
            products: []
        }
        carts.push(newCart);
        await this.#saveFile(JSON.stringify(carts, null, 2));

        return newCart;
    }

    static async getCartById(cid) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === cid);
    }

    static async addProductToCart(cid, pid) {
        let carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        if(pid === -1){
            throw new Error('Producto no existe');
        }
        
        const productInCart = cart.products.find(p => p.product === pid);

        if (productInCart) {
            productInCart.quantity += 1; // Incrementa la cantidad si ya existe
        } else {
            cart.products.push({ product: pid, quantity: 1 }); // Agrega un nuevo producto
        }

        await this.#saveFile(JSON.stringify(carts, null, 2));

        return cart;
    }

}

module.exports = CartManager;