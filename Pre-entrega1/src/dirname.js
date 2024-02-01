import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//createHash- Aplicara el hash al password
//isValidPassword - Compara el password que coloca el cliente con la que guardo en la base de datos

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>{
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
    
}

export const PRIVATE_KEY = "CoderHouseBackenCourseSecretKeyJWT";

export const generateJWToken = (user) =>{
    //dentro de sign va primer argumento objeto, segundo la firma y tercer el tiempoo que va a durrar el jwt
    return jwt.sign({user}, PRIVATE_KEY, { expiresIn: '24h'})
}

export const authToken = (req, res, next) =>{
    //el token se guarda en los headers de autorizacion, archivo register linea 14
    const authHeader = req.headers.authorization;
    console.log("Token present is header auth");
    console.log(authHeader);

    if (!authHeader){
        return res.status(401).send({ error: "User not authenticated or missing token"});
    }

    const token = authHeader.split('')[1]
    //validamos token
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!"});
        //si el token esta ok
        req.user = credentials.user;
        console.log(req.user);
        next();
    })
}; 

// para manejo de errores
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};

// para manejo de Auth
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")

        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next()
    }
};


export { __dirname };