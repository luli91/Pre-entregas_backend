import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from "passport";
// import { faker } from '@faker-js/faker';
import { getLogger } from './config/loggerConfig.js';

const logger = getLogger();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//createHash- Aplicara el hash al password
//isValidPassword - Compara el password que coloca el cliente con la que guardo en la base de datos

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>{
    logger.info(`Datos a validar: user-password: ${user.password}, password: ${password}`);
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
    logger.info("Token present is header auth");
    logger.info(authHeader);

    if (!authHeader){
        return res.status(401).send({ error: "User not authenticated or missing token"});
    }

    const token = authHeader.split('')[1]
    //validamos token
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({ error: "Token invalid, Unauthorized!"});
        //si el token esta ok
        req.user = credentials.user;
        logger.info(req.user);
        next();
    })
}; 

// para manejo de errores
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        logger.info("Entrando a llamar strategy: ");
        logger.info(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            logger.info("Usuario obtenido del strategy: ");
            logger.info(user);
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


// faker.locale = 'es'; //Idioma de los datos
// export const generateUser = () => {
//     let numOfProducts = parseInt(faker.random.numeric(1, { bannedDigits: ['0'] }));
//     // Crear una lista de roles posibles
//     const roles = ['admin', 'usuario', 'editor', 'invitado'];
//     let products = [];
//     for (let i = 0; i < numOfProducts; i++) {
//         products.push(generateProduct());
//     }
//     return {
//         name: faker.name.firstName(),
//         last_name: faker.name.lastName(),
//         sex: faker.name.sex(),
//         birthDate: faker.date.birthdate(),
//         products: products,
//         image: faker.internet.avatar(),
//         id: faker.database.mongodbObjectId(),
//         email: faker.internet.email(),
//         rol: roles[Math.floor(Math.random() * roles.length)]
//     };
// };

// export const generateProduct = () => {
//     return {
//         title: faker.commerce.productName(),
//         price: faker.commerce.price(),
//         stock: faker.random.numeric(1),
//         id: faker.database.mongodbObjectId(),
//         image: faker.image.image()
//     }
// };
// console.log(generateUser());
// console.log(generateProduct());
export { __dirname };