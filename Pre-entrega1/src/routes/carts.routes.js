import { Router } from 'express';
import CartManager from '../manager/CartManager.js'

const router = Router();
const cartManager = new CartManager('./Pre-entrega1/src/data/carts.json');

router.post('/', async (req, res) => {
    const cart = await cartManager.addCart();
    if (cart) {
        res.json(cart);
    } else {
        res.status(500).json({ error: 'Hubo un error al crear el carrito' });
    }
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cart = cartManager.getCartById(Number(cid));
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const respuesta = await cartManager.addProductToCart(Number(cid), Number(pid));
    if (respuesta) {
        res.json({ status: 'Producto agregado al carrito' });
    } else {
        res.status(500).json({ error: 'Hubo un error al agregar el producto al carrito' });
    }
});

export default router;
