import { Router } from 'express';
import { passportCall, authorization } from '../dirname.js';


const router = Router();


router.get("/login", (req, res) => {
    res.render('login')
});

router.get("/register", (req, res) => {
    res.render('register')
});

router.get("/",
    passportCall('jwt'), 
    authorization('user'),
    (req, res) => {
        res.render("profile", {
            user: req.user
        });
    }
);


router.get("/error", (req, res) => {
    res.render("error");
});

export default router;