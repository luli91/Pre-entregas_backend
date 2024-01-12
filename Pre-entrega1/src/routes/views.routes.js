
import { Router } from "express";
// import messageDao from "../daos/dbManager/message.dao.js";
// import productDao from "../daos/dbManager/product.dao";

const router = Router();

router.get("/", (req, res) => {
    res.redirect("/login");
});

router.get('/products', async (req, res) => {
    let { limit, page } = req.query;
    limit = limit ? parseInt(limit) : 10;
    page = page ? parseInt(page) : 1;
    const products = await productDao.getProducts({ limit, page });
    res.render('products', { products: products.payload, pagination: products });
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    res.render('cart', { cart });
});

router.get("/register", (req, res) => {
    res.render('register')
})


router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido!!')
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.json({ error: 'Error logout', msg: "Error al cerrar la session" })
        }
        res.send('Session cerrada correctamente!')
    })
});


router.get('/login', (req, res) => {

    const { username, password } = req.query
    // Verifica si el objeto 'user' existe en la sesión. Si no existe, créalo.
    if (!req.session.user) {
        req.session.user = {};
    }

    if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        req.session.user.role = 'admin';
    } else {
        req.session.user.role = 'usuario';
    }
});

// Middleware de autenticación
function auth(req, res, next) {
    // Verifica si el objeto 'user' existe en la sesión. Si no existe, envía un mensaje de error.
    if (!req.session.user) {
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }

    // Ahora puedes acceder a 'req.session.user.role' sin obtener un TypeError
    if (req.session.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
}


router.get('/private', auth, (req, res) => {
    res.send('Si estas viendo esto es porque estas autorizado a este recurso!')
});


export default router;