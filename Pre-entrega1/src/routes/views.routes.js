
import { Router } from "express";
import productDao from "../daos/dbManager/product.dao.js";
import cartDao from "../daos/dbManager/cart.dao.js";
import { passportCall } from "../dirname.js";


const router = Router();

router.get('/', (req, res) => {
    res.render('login')
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

    if (username != 'adminCoder@coder.com' || password !== 'adminCod3r123') {
        return res.status(401).send("Login failed, check your credentianls")
    } else {
        req.session.user = username;
        req.session.admin = false;
        res.send('Login Successful!!')
    }
});

// Middleware autenticacion 
function auth(req, res, next) {
    if (req.session.user.role === 'admin') {
        return next()
    } else {
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
}

router.get('/private', auth, (req, res) => {
    res.send('Si estas viendo esto es porque estas autorizado a este recurso!')
});

// Middleware de autorización
function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send('Acceso denegado');
        }
        next();
    }
}

router.post('/products', passportCall('jwt'), authorize('admin'), (req, res) => {
    // Sólo el administrador puede crear productos
});

router.put('/products/:id', passportCall('jwt'), authorize('admin'), (req, res) => {
    // Sólo el administrador puede actualizar productos
});

router.delete('/products/:id', passportCall('jwt'), authorize('admin'), (req, res) => {
    // Sólo el administrador puede eliminar productos
});

router.post('/chat', passportCall('jwt'), authorize('user'), (req, res) => {
    // Sólo el usuario puede enviar mensajes al chat
});

router.post('/cart', passportCall('jwt'), authorize('user'), (req, res) => {
    // Sólo el usuario puede agregar productos a su carrito
});


export default router;