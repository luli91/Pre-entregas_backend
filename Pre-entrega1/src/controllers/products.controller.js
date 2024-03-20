//importa los servicios
import productDao from '../daos/dbManager/product.dao.js';
import { obtenerDatos, crearDato, deleteServices } from '../services/products.services.js';
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

export const getDatosControllers = async (req, res) => {
    let datos = await obtenerDatos();
    res.json(datos);
}

export const postDatosControllers = async (req, res) => {
    let dato = req.body;
    await crearDato(dato);
    res.json({dato})
}

export const deleteDatosControllers = async (req, res) => {
    let {id} = req.params;
    await deleteServices (id);
    res.json ({ msj:"delete product"})
}

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    const product = await productDao.findById(pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
}

export const getProducts = async (req, res) => {
    const products = await productDao.findProduct({});
    res.render('products', {
        user: req.session.user,
        products: products.docs
    });
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await productDao.updateProduct(id, req.body);
        logger.info(`Product updated: ${JSON.stringify(post)}`);
        res.json({
            post,
            message: "Product updated",
        });
    } catch (error) {
        logger.error(error);
        res.json({
            error,
            message: "Error",
        });
    }
}
