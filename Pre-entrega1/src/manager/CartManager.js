import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.currentId = 1;

        if(fs.existsSync(path)){
            try{
                let carts = fs.readFileSync(path, "utf8");
                this.carts = JSON.parse(carts); 
            } catch (error) {
                this.carts = [];
            }
        } else {
            this.carts = [];
            fs.writeFileSync(path, JSON.stringify(this.carts, null, "\t"));
        }
    }

    async saveFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async addCart() {
        const cart = {
            id: this.currentId++,
            products: []
        };
        this.carts.push(cart);
        const respuesta = await this.saveFile(this.carts);
        return respuesta ? cart : null;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    async addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            console.error("Carrito no encontrado");
            return;
        }

        const productIndex = cart.products.findIndex(product => product.product === productId);
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity++;
        }

        const respuesta = await this.saveFile(this.carts);
        return respuesta;
    }
}
