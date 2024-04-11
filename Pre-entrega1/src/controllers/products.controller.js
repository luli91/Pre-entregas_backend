//importa los servicios
import productDao from '../daos/dbManager/product.dao.js';
import { obtenerDatos, crearDato, deleteServices } from '../services/products.services.js';
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

export const getDatosControllers = async (req, res) => {
    let datos = await obtenerDatos(req);
    res.json(datos);
}

export const postDatosControllers = async (req, res) => {
    let dato = req.body;
    // Si no se proporciona un owner, se asigna 'admin'
    dato.owner = dato.owner || 'admin';
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
        const product = await productDao.findById(id);
        if (req.user.role !== 'admin' && req.user._id !== product.owner) {
            return res.status(403).send('No tienes permiso para modificar este producto');
        }
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

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await productDao.findById(id);
    if (req.user.role !== 'admin' && req.user._id !== product.owner) {
        return res.status(403).send('No tienes permiso para eliminar este producto');
    }

    const deletedProduct = await productDao.deleteProduct(id);
    if (deletedProduct) {
        res.json({ status: 'Producto eliminado con éxito' });
    } else {
        res.status(500).json({ error: 'Hubo un error al eliminar el producto' });
    }
};

export const updateStockController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productDao.findById(id);
        // Verifica si el usuario tiene permiso para modificar el producto
        if (req.user.role !== 'admin' && req.user._id !== product.owner) {
            return res.status(403).send('No tienes permiso para modificar este producto');
        }
        // Actualiza el stock del producto con los datos proporcionados en req.body
        const updatedProduct = await productDao.updateProduct(id, req.body);
        logger.info(`Stock updated for product: ${JSON.stringify(updatedProduct)}`);
        res.json({
            updatedProduct,
            message: "Stock updated",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}