import { cartModel } from "../../models/cart.model.js";

class CartDao {
    async findCarts() {
        return await cartModel.find();
    }

    async getCartById(_id) {
        return await cartModel.findById(_id);
    }

    async createCart(cart) {
        return await cartModel.create(cart);
    }

    async updateCart(_id, cart) {
        return await cartModel.findByIdAndUpdate({ _id }, cart);
    }

    async addProductToCart(_id, product) {
        const cart = await this.getCartById(_id);
        if (!cart) {
            console.error("Carrito no encontrado");
            return;
        }

        const productInCart = cart.products.find(p => p.product.toString() === product.product);
        if (productInCart) {
            // si el producto ya está en el carrito, aumento la cantidad
            productInCart.quantity++;
        } else {
            // Si el producto no está en el carrito, lo agrego con cantidad 1
            cart.products.push(product);
        }

        return await this.updateCart(_id, cart);
    }
}

export default new CartDao();
