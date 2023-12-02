import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./Pre-entrega1/src/data/productos.json');

router.get("/", (req, res) => {
    res.render("home.hbs");
});

router.get("/realtimeproducts", (req, res) => {
    res.render("products.hbs");
});

export default router;