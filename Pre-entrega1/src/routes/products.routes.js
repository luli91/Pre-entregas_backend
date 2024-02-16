import { Router } from 'express';
//importar controller 
import productDao from '../daos/dbManager/product.dao.js';
import { getDatosControllers, postDatosControllers, deleteDatosControllers} from '../controllers/products.controller.js'
const router = Router();

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productDao.findById(pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.get("/", getDatosControllers);

router.get('/products', async (req, res) => {
    const products = await productDao.findProduct({});
    res.render('products', {
        user: req.session.user,
        products: products.docs
    });
});



router.post("/", postDatosControllers);

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const post = await productDao.updateProduct(id, req.body);

        res.json({
            post,
            message: "Product updated",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

router.delete("/:id", deleteDatosControllers );


export default router;