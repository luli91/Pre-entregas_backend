import { Router } from "express";


const router = Router();

router.get('/products', async (req, res) => {
    let { limit, page } = req.query;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    const products = await productDao.getProducts({ limit, page });
    res.render('products', { products: products.payload, pagination: products });
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    res.render('cart', { cart });
});


export default router;