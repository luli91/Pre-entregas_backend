import { Router } from 'express';
import ProductManager from './manager/ProductManager.js';

const router = Router();

const productManager = new ProductManager();
let products = productManager.getProducts();



// Ruta para obtener todos los productos
router.get('/', (req, res) => {

    const limit = req.query.limit;
    let products = ProductManager.getProducts();
    if (limit) {
        products = products.slice(0, limit);
    }
    res.json(products);
});

// Ruta para obtener un producto por su id

router.get('/:pid', (req, res) => {
    const { pid } = req.params;

    const producto = products.find((product) => Number(product.id) === Number(pid));

    if(!producto){
        return res.json({
            error: "Producto no encontrado"
        });
    }

    res.json ({
        producto,
    });
});

export default router;
