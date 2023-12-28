import { Router } from 'express';

import productDao from '../daos/dbManager/product.dao.js';

const router = Router();


router.get("/", async (req, res) => {
    try {
        let { limit, page, sort, title, minStock } = req.query;

        // Establecer valores predeterminados
        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;
        sort = sort ? { price: sort === 'asc' ? 1 : -1 } : {};

        // Crear el objeto de consulta
        let query = {};
        if (category) {
            query.category = category;
        }
        if (minStock) {
            query.stock = { $gte: minStock };
        }

        // Calcular el número de documentos a omitir
        const skip = (page - 1) * limit;

        // Realizar la consulta con los parámetros
        const result = await productDao.findProduct(query, sort, skip, limit);

        // Crear el objeto de respuesta
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