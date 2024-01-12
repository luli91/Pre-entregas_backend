
// import { Router } from 'express';
// import productDao from '../daos/dbManager/product.dao.js';

// const router = Router();


// router.get("/login", (req, res) => {
//     res.render('login')
// })

// router.get("/register", (req, res) => {
//     res.render('register')
// })

// router.get("/", async (req, res) => {
//     try {
//         const products = await productDao.findProduct({}, {});
//         res.render('products', {
//             user: req.session.user,
//             products: products.docs
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error al obtener los productos");
//     }
// });


// export default router;