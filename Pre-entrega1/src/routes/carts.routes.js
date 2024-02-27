import { Router } from 'express';
import CartDao from '../daos/dbManager/cart.dao.js';
import productDao from '../daos/dbManager/product.dao.js';
import Ticket from '../models/ticket.model.js'
import ticketDao from '../daos/dbManager/ticket.dao.js '

const router = Router();
const cartDao = CartDao;

router.post('/', async (req, res) => {
    const cart = await cartDao.createCart({ products: [] });
    if (cart) {
        res.json(cart);
    } else {
        res.status(500).json({ error: 'Hubo un error al crear el carrito' });
    }
});

router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    res.render('cart', { cart });
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const respuesta = await cartDao.removeProductFromCart(cid, { product: pid });
    if (respuesta) {
        res.json({ status: 'Producto eliminado del carrito' });
    } else {
        res.status(500).json({ error: 'Hubo un error al eliminar el producto del carrito' });
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = req.body; // req.body es el nuevo array de productos
    const respuesta = await cartDao.updateCart(cid, cart);
    if (respuesta) {
        res.json({ status: 'Carrito actualizado', cart: respuesta });
    } else {
        res.status(500).json({ error: 'Hubo un error al actualizar el carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const product = { product: pid, quantity: req.body.quantity };
    const respuesta = await cartDao.addProductToCart(cid, product);
    if (respuesta) {
        res.json({ status: 'Cantidad de producto actualizada' });
    } else {
        res.status(500).json({ error: 'Hubo un error al actualizar la cantidad del producto' });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    const respuesta = await cartDao.updateCart(cid, { products: [] });
    if (respuesta) {
        res.json({ status: 'Todos los productos eliminados del carrito' });
    } else {
        res.status(500).json({ error: 'Hubo un error al eliminar los productos del carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const product = { product: pid, quantity: 1 };
    const respuesta = await cartDao.addProductToCart(cid, product);
    if (respuesta) {
        res.json({ status: 'Producto agregado al carrito' });
    } else {
        res.status(500).json({ error: 'Hubo un error al agregar el producto al carrito' });
    }
});

router.post('/:cid/purchase', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartDao.getCartById(cid);
        const productsNotPurchased = []; // Arreglo para almacenar los IDs de productos no procesados

        // Iterar sobre cada producto en el carrito
        for (const item of cart.items) {
            const product = await productDao.findById(item.productId);

            // Verificar si hay suficiente stock
            if (product.stock < item.quantity) {
                productsNotPurchased.push(item.productId);

                return res.status(400).send(`No hay suficiente stock para el producto: ${product.name}`);
            }else{

            // Restar la cantidad comprada del stock del producto
            product.stock -= item.quantity;
            await productDao.updateProduct(product);
            }
        }

         // Crear un nuevo Ticket
        const ticket = new Ticket({
            code: generateUniqueCode(), // Esta función debe generar un código único
            purchase_datetime: new Date(),
            amount: calculateTotal(cart), // Esta función debe calcular el total de la compra
            purchaser: req.user.email,
        });

        // Guardar el Ticket en la base de datos
        await ticketDao.saveTicket(ticket);

        // Filtrar el carrito para contener solo los productos no comprados
        const filteredItems = cart.items.filter(item => !productsNotPurchased.includes(item.productId));
        cart.items = filteredItems;
        await cartDao.updateCart(cart);

        res.send({
            message: 'Compra finalizada con éxito',
            productsNotPurchased, // Devolver los IDs de productos no procesados
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).send('Error al procesar la compra');
    }
});

export default router;

