import fs from 'fs'

export class ProductManager{
    static #path = '';

    static setPath(filePath = ''){
        this.#path = filePath;
    }

    static async getProducts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
        }
        else{
            return  [];

        }
    }

    static async #saveFile(data = '') {
        if (typeof data !== 'string') {
            throw new Error('Error en saveFile: formato de datos inválido');
        }
        await fs.promises.writeFile(this.#path, data);
    }

    static async addProduct(product = {}){
        let products = await this.getProducts();
        let id = 1;

        if(products.length  > 0){
            id = Math.max(...products.map(p => p.id)) + 1;
        }

        let newProduct = {
            id,
            ...product,
            status: product.status ?? true, 
        }

        products.push(newProduct);
        await this.#saveFile(JSON.stringify(products,null,2))

        return newProduct;
    }

    static async getProductById(pid) {
        const products = await this.getProducts();
        return products.find(p => p.id === pid);
    }

    static async updateProduct(pid, updatedData = {}){
        let products = await this.getProducts();
        const index = products.findIndex(p => p.id === pid)

        if(index === -1){
            throw new Error("Producto no encontrado")
        }ç

        const {id, ...rest} = updatedData;
        products[index] = {...products[index], ...rest};
        await this.#saveFile(JSON.stringify(products, null, 2));

        return products[index];
    }

    static async deleteProduct(pid){
        let products = await this.getProducts();
        const updatedProducts = products.filter(p => p.id !== pid)

        if(updatedProducts.length === products.length){
            throw new Error("Producto no encontrado")
        }

        await this.#saveFile(JSON.stringify(updatedProducts,null,2));

        return true;
    }
}
