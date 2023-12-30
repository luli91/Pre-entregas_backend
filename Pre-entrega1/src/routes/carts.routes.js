import { Router } from 'express';
import CartDao from '../dao/dbmanager/CartDao.js'

const router = Router();
const cartDao = new CartDao();

router.post('/', async (req, res) => {
    const cart = await cartDao.createCart({ products: [] });
    if (cart) {
        res.json(cart);
    } else {
        res.status(500).json({ error: 'Hubo un error al crear el carrito' });
    }
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
    const respuesta = await cartDao.updateCart(cid, req.body);
    if (respuesta) {
        res.json({ status: 'Carrito actualizado' });
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


export default router;

