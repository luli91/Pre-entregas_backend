
import { Router } from 'express';
// import productDao from '../daos/dbManager/product.dao.js';

const router = Router();


router.get("/login", (req, res) => {
    res.render('login')
})


router.get("/register", (req, res) => {
    res.render('register')
})

router.get("/", (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
})


export default router;