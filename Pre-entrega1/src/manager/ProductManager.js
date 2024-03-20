import fs from 'fs';
import { getLogger } from './config/loggerConfig.js';

const logger = getLogger();


export default class ProductManager{
    constructor (path) {
        this.path = path;
        this.products = [];
        this.currentId = 1;
        if(fs.existsSync(path)){
            try{
                let products = fs.readFileSync(path, "utf8");
                this.products = JSON.parse(products);
                if (!Array.isArray(this.products)) {
                    throw new Error('Los productos deben ser un array');
                }
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
            fs.writeFileSync(path, JSON.stringify(this.products, null, "\t"));
        }
    }

    async saveFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }

    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;

        if (!title || !description || !price || !thumbnail || !code || !stock) {

            return {error:"Todos los campos son obligatorios"};
        }

    const existingProduct = this.products.find(existingProduct => existingProduct.code === product.code);


    if (existingProduct) {
        return {error: "El producto ya existe"};
    }

        product.id = this.currentId++;
        this.products.push(product);
        const respuesta = await this.saveFile(this.products);
        return respuesta ? product : {error: "Error al guardar el producto"};
    }

    getProducts() {
        // console.log(this.products);
        return this.products;
    }

    getProductById(id) {
        for (let product of this.products) {
            if (product.id === id) {
                return product;
            }
        }
        logger.error("Producto no encontrado");
    }
    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            logger.error("Producto no encontrado");
            return;
        }

        this.products.splice(productIndex, 1);

        const respuesta = await this.saveFile(this.products);
        return respuesta;
    }

}    

export class Product{
    constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail= thumbnail;
    this.code =code;
    this.stock = stock;
    }
}