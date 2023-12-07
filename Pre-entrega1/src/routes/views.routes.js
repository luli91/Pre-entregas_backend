import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./Pre-entrega1/src/data/productos.json');

router.get("/", async (req, res) => {
    let products = await productManager.getProducts(); // obtén tus productos de alguna manera
    res.render('home', {products: products}); // renderiza tu plantilla con tus datos
});

router.get("/realtimeproducts", (req, res) => {
    res.render("products.hbs");
});

export default router;