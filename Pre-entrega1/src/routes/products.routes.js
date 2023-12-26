import { Router } from 'express';
// import ProductManager from '../manager/ProductManager.js';
import productDao from '../daos/dbManager/product.dao.js';
// import { productModel } from '../models/product.model.js';
// import { userModel } from '../models/user.model.js';

const router = Router();
// const productManager = new ProductManager('./Pre-entrega1/src/data/productos.json');

router.get("/", async (req, res) => {
    try {
        const product = await productDao.findProduct();
        res.json({
            data: product,
            message: "Products list",
        });
    } catch (error) {
        console.log(error);
        res.json({
            error,
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

// // ruta para obtener todos los productos
// router.get('/', (req, res) => {

//     const limit = req.query.limit;
//     let products = productManager.getProducts();
//     if (limit) {
//         products = products.slice(0, limit);
//     }
//     res.json(products);
// });

// // ruta para obtener un producto por su id

// router.get('/:pid', (req, res) => {
    
//     const { pid } = req.params;

//     const producto = productManager.getProductById(Number(pid));

//     if(!producto){
//         return res.json({
//             error: "Producto no encontrado"
//         });
//     }

//     res.json ({
//         producto,
//     });
// });


// router.post('/', async (req, res) => {
//     const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;

//     // verifica que todos los campos requeridos estén presentes
//     if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
//         return res.status(400).json({ error: 'Todos los campos son obligatorios' });
//     }

//     // crea un nuevo producto
//     const product = {
//         id: productManager.currentId++,  // autogenera el id
//         title,
//         description,
//         price,
//         thumbnail,
//         code,
//         stock,
//         status: true,  // Por defecto es true
//         category,
//         thumbnails: thumbnails || []  // si thumbnails no está presente, se inicializa como un array vacío
//     };

//     // intenta agregar el producto
//     try{
//         const respuesta = await productManager.addProduct(product);
//         if(respuesta?.error) {  // Aca capturas el error que devuelve addProduct
//         return res.status(404).json({error: respuesta.error})
//         }
//         res.status(201).json(product);
//     } catch(error) {
    
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }    

// });

// // Ruta para actualizar un producto por su id
// router.put('/:pid', async (req, res) => {
//     const { pid } = req.params;
//     const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;

//     const index = productManager.products.findIndex((product) => product.id === Number(pid));

//     if (index === -1) {
//         return res.json({
//             error: "Producto no encontrado"
//         });
//     }

//     productManager.products[index] = {
//         id: Number(pid),
//         title,
//         description,
//         price,
//         thumbnail,
//         code,
//         stock,
//         status: true,  // Por defecto es true
//         category,
//         thumbnails: thumbnails || []  // si thumbnails no esta presente, se inicializa como un array vacio
//     };

//     res.json({
//         status: "Actualizado",
//         producto: productManager.products[index]
//     });
//     await productManager.saveFile();
// });

// // Ruta para eliminar un producto por su id
// router.delete('/:pid', async (req, res) => {
//     const { pid } = req.params;

//     const index = productManager.products.findIndex((product) => product.id === Number(pid));

//     if (index === -1) {
//         return res.json({
//             error: "Producto no encontrado"
//         });
//     }

//     productManager.products.splice(index, 1);

//     res.json({
//         status: "Producto eliminado"
//     });
//     // Guarda los cambios en el archivo
//     await productManager.saveFile();
// });

export default router;