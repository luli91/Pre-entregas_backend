import { Router } from 'express';
import CartDao from '../daos/dbManager/cart.dao.js'

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

export default router;

