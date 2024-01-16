import { Router } from 'express';

import productDao from '../daos/dbManager/product.dao.js';

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

router.get("/", async (req, res) => {
    try {
        let { limit, page, sort, category, minStock } = req.query;

        // Establece valores predeterminados
        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        sort = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

        // Crea el objeto de consulta
        let query = {};
        if (category) {
            query.category = category;
        }
        if (minStock) {
            query.stock = { $gte: minStock };
        }

        // Crea el objeto de opciones para paginate
        const options = {
            page,
            limit,
            sort
        };

        // Realiza la consulta con los parámetros
        const result = await productDao.findProduct(query, options);

        // Crea el objeto de respuesta
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}&limit=${limit}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}&limit=${limit}` : null
        };

        res.json(response);
    } catch (error) {
        console.log(error);
        res.json({
            status: 'error',
            message: "Error",
        });
    }
});

router.get('/products', async (req, res) => {
    const products = await productDao.findProduct({});
    res.render('products', {
        user: req.session.user,
        products: products.docs
    });
});



router.post("/", async (req, res) => {
    try {

        const products = await productDao.createProduct(req.body);

        res.json({
            products,
            message: "Product created",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});

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

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const products = await productDao.delete(id);

        res.json({
        products,
        message: "Product deleted",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
            message: "Error",
        });
    }
});


export default router;