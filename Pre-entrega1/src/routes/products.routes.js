import { Router } from 'express';
//importar controller 
import { getDatosControllers, postDatosControllers, deleteDatosControllers, getProductById, getProducts, updateProduct } from '../controllers/products.controller.js'


const router = Router();

router.get('/:pid', getProductById);

router.get("/", getDatosControllers);

router.get('/products', getProducts);

router.post("/", postDatosControllers);

router.put("/:id", updateProduct);

router.delete("/:id", deleteDatosControllers );

export default router;