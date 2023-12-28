import express from 'express';
import messageRouter from "./routes/message.routes.js";
import productsRouter from "./routes/products.routes.js";
// import ProductManager from './manager/ProductManager.js';
// import { Product } from './manager/ProductManager.js';
import handlebars from "express-handlebars";
import { __dirname } from "./dirname.js";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";

import MessageDao from './daos/dbManager/message.dao.js';


const app = express ();
const PORT = 5000;
// //movimos el app.listen
const httpServer = app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`)
);

// Instanciar Websocket
//creamos un servidor para sockets viviendo dentro de nuestro servidor principal
const io = new Server(httpServer);

mongoose
.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() =>{
    console.log("conected DB");
})
.catch((error)=> {
    console.log(error);
    console.log("error connecting DB");
});


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


//routes
app.use('/api/messages', messageRouter);
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);



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
            io.emit('message', data);
        }).catch((error) => console.log(error));
    });
});
