import { Router } from 'express';
import passport from 'passport';

const router = Router();

//passportlocal
// Register
router.post('/register', passport.authenticate ('register', {
    failureRedirect: 'api/session/fail-register'
}), async (req, res) => {

    console.log("Registrando usuario:");

    res.status(201).send({ status: "success", message: "Usuario creado con exito." });
})


// Login
router.post('/login', passport.authenticate('login',
    {
        failureRedirect: 'api/session/fail-login'
    }
), async (req, res) => {
    console.log("Usuario encontrado para login");

    const user = req.user;
    console.log(user);

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    res.send({ status: "success", payload: req.session.user, message: "Primer logueo realizado!" });
})

//passport github
router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    { }
})
//api github
router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/users")
})


//passport local

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Falló el proceso de login!" });
});


export default router;