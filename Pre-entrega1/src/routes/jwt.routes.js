import { Router } from 'express';
import userModel from '../models/user.model.js';
import passport from 'passport';
import { isValidPassword } from '../dirname.js';
import { generateJWToken } from '../dirname.js';
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate('github', { session: false, failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;

    // conJWT 
    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    };
    const access_token = generateJWToken(tokenUser);
    logger.info(access_token);

    res.cookie('jwtCookieToken', access_token,
        {
            maxAge: 60000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie

        }

    )
    res.redirect("/users");

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        logger.info("Usuario encontrado para login:");
        logger.info(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        logger.info(access_token);
    
        //guardo el token en una Cookie
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,

            }

        )
        res.send({ message: "Login success!!" })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }

});

// Register
router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
    logger.info("Registrando usuario:");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
})

router.get('/api/sessions/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user);
});

export default router;