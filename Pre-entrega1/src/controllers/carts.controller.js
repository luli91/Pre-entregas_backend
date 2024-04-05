import { cartService } from '../services/carts.services.js';
import { updateStockController } from './products.controller.js';
import { sendEmail, mensajeCompra } from './email.controller.js';
import CustomError from "../services/errors/custom.errors.js";
import EErrors from "../services/errors/errors-enum.js";

export const createCartController = async (req, res) => {
    const userID = req.params.uid;
    try {
        const newCart = await cartService.createCart(userID);
        res.status(201).json(newCart);
    } catch (error) {
        throw new CustomError('Error al crear el carrito', EErrors.DATABASE_ERROR);
    }
};

export const getCartByIdController = async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            throw new CustomError('Carrito no encontrado', EErrors.ROUTING_ERROR);
        }
        res.json(cart);
    } catch (error) {
        throw new CustomError('Error al obtener el carrito', EErrors.DATABASE_ERROR);
    }
};

export const updateCartController = async (req, res) => {
    const { cid } = req.params;
    const cart = req.body; // req.body es el nuevo array de productos
    try {
        const respuesta = await cartService.updateCart(cid, cart);
        if (!respuesta) {
            throw new CustomError('Error al actualizar el carrito', EErrors.DATABASE_ERROR);
        }
        res.json({ status: 'Carrito actualizado', cart: respuesta });
    } catch (error) {
        throw new CustomError('Error al actualizar el carrito', EErrors.DATABASE_ERROR);
    }
};

export const addProductToCartController = async (req, res) => {
    const cartID = req.params.cid;
    const productID = req.params.pid;
    const quantity = req.params.qtty;
    try {
        const updatedCart = await cartService.addProductToCart(cartID, productID, quantity);
        if (!updatedCart) {
            throw new CustomError('Error al agregar el producto al carrito', EErrors.DATABASE_ERROR);
        }
        res.status(200).json(updatedCart);
    } catch (error) {
        throw new CustomError('Error al agregar el producto al carrito', EErrors.DATABASE_ERROR);
    }
};

export const getCartByUserIdController = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartService.getCartByUserId(cid);
        if (!cart) {
            throw new CustomError('Carrito no encontrado', EErrors.ROUTING_ERROR);
        }
        res.json(cart);
    } catch (error) {
        throw new CustomError('Error al obtener el carrito', EErrors.DATABASE_ERROR);
    }
};

export const removeProductFromCartController = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const respuesta = await cartService.removeProductFromCart(cid, pid);
        if (!respuesta) {
            throw new CustomError('Error al eliminar el producto del carrito', EErrors.DATABASE_ERROR);
        }
        res.json({ status: 'Producto eliminado del carrito' });
    } catch (error) {
        throw new CustomError('Error al eliminar el producto del carrito', EErrors.DATABASE_ERROR);
    }
};

export const deleteWholeCartController = async (req, res) => {
    const { cid } = req.params;
    try {
        const respuesta = await cartService.deleteWholeCart(cid);
        if (!respuesta) {
            throw new CustomError('Error al eliminar los productos del carrito', EErrors.DATABASE_ERROR);
        }
        res.json({ status: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        throw new CustomError('Error al eliminar los productos del carrito', EErrors.DATABASE_ERROR);
    }
};

export const purchaseCartController = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productsFromCart = await getProductsFromCartById(cartId);
        const { validProducts, invalidProducts } = evaluateStock(productsFromCart);
        let grandTotal = 0;
        for (const product of validProducts) {
            grandTotal += product.productId.price * product.quantity;
            await updateStockController(product.productId, product.quantity);
            const reqs = { cid: cartId, pid: product.productId };
            await deleteProductFromCartByIdController(reqs, res);
        }
        if (validProducts.length > 0) {
            const ticket = { amount: grandTotal, purchaser: req.session.user.username };
            const createdTicket = await createTicket(ticket, res);
            sendEmail(req.session.user.email, " compra realizada ", mensajeCompra(req.session.user.username, grandTotal, "code"));
        }
    } catch (error) {
        console.error("Error en purchaseCartController:", error);
    }
};

function evaluateStock(productsFromCart) {
    const validProducts = [];
    const invalidProducts = [];
    productsFromCart.forEach((product) => {
        if (product.quantity <= product.productId.stock) {
            validProducts.push(product);
        } else {
            invalidProducts.push(product);
        }
    });
    return { validProducts, invalidProducts };
}

async function getProductsFromCartById(cartId) {
    try {
        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            throw new CustomError('Carrito no encontrado', EErrors.ROUTING_ERROR);
        }
        return cart.products;
    } catch (error) {
        throw new CustomError('Error al obtener los productos del carrito', EErrors.DATABASE_ERROR);
    }
}
