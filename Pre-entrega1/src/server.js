import express from 'express';
import messageRouter from "./routes/message.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
// import ProductManager from './manager/ProductManager.js';
// import { Product } from './manager/ProductManager.js';
import handlebars from "express-handlebars";
import { __dirname } from "./dirname.js";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";
import MessageDao from './daos/dbManager/message.dao.js';
import jwtRouter from './routes/jwt.routes.js';
import usersViewRouter from './routes/users.views.routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from "./config/passport.config.js"
import githubLoginViewRouter from './routes/github-login.views.routes.js'
import dotenv, { config } from 'dotenv';

dotenv.config();
const app = express ();

const PORT = config.PORT;
const MONGO_URL = process.env.MONGO_URL;


// Instanciar Websocket
//creamos un servidor para sockets viviendo dentro de nuestro servidor principal
const io = new Server(httpServer);


// Middlewares(envian info por medio de post)
app.use(express.json())
app.use (express.urlencoded({extended: true}));

// Configuramos el motor de plantilla (handlebars)
app.engine('hbs', handlebars.engine({
    extname: '.hbs',//el nombre del archivo lo definimos acá. porej: index.hbs
    defaultlayout: 'main' //toma la plantilla principal
    })
);
//seteamos el motor, acá es donde le dices a Express.js dónde buscar tus archivos de vistas.
app.set("view engine", "hbs");
app.set("views", `${__dirname}/view`);
//public- la carpeta que es acessible al cliente
app.use(express.static(`${__dirname}/public`));


app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 10 * 60 // Tiempo de vida de la sesión en segundos
    }),
    secret: 'coderS3cr3t', 
    resave: false,
    saveUninitialized: true,
}));

//midleware de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter);
app.use('/api/messages', messageRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/users', usersViewRouter);
app.use ('/api/jwt', jwtRouter);
app.use("/github", githubLoginViewRouter);

const httpServer = app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`)
)

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    // Muestro mensajes antiguos
    MessageDao.findMessages().then((messages) => {
        socket.emit('messages', messages);
    });

    socket.on("message", (data) => {
        console.log(data);

        //Envio mensajes a todos los clientes
        MessageDao.createMessage(data).then(() => {
            io.emit('messages', data);
        }).catch((error) => console.log(error));
    });
});

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Conectado con exito a la DB usando Mongoose!!");
    } catch (error) {
        console.error("No se pudo conectar a la BD usando Moongose: " + error);
        process.exit();
    }
}
connectMongoDB();