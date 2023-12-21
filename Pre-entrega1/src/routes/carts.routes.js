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


// import { Router } from 'express';
// import CartManager from '../manager/CartManager.js'

// const router = Router();
// const cartManager = new CartManager('./Pre-entrega1/src/data/carts.json');

// router.post('/', async (req, res) => {
//     const cart = await cartManager.addCart();
//     if (cart) {
//         res.json(cart);
//     } else {
//         res.status(500).json({ error: 'Hubo un error al crear el carrito' });
//     }
// });

// router.get('/:cid', (req, res) => {
//     const { cid } = req.params;
//     const cart = cartManager.getCartById(Number(cid));
//     if (!cart) {
//         return res.status(404).json({ error: 'Carrito no encontrado' });
//     }
//     res.json(cart);
// });

// router.post('/:cid/product/:pid', async (req, res) => {
//     const { cid, pid } = req.params;
//     const respuesta = await cartManager.addProductToCart(Number(cid), Number(pid));
//     if (respuesta) {
//         res.json({ status: 'Producto agregado al carrito' });
//     } else {
//         res.status(500).json({ error: 'Hubo un error al agregar el producto al carrito' });
//     }
// });

// export default router;
