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

router.get("/current",
    passportCall('jwt'), 
    authorization('user'),
    (req, res) => {
        const userDto = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        };
        res.json(userDto);
    }
);


router.get("/forgotPassword", (req, res) => {
    res.render('forgotPassword')
});


router.get("/resetPassword/:token", (req, res) => {
    const { token } = req.params;
    res.render('resetPassword', { token });
});

export default router;