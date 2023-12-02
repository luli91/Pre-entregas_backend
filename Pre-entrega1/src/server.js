import express from 'express';
import carts from "./routes/carts.js";
import products from "./routes/products.js";
import ProductManager from './manager/ProductManager.js';
import { Product } from './manager/ProductManager.js';
import handlebars from "express-handlebars";
import { __dirname } from "./dirname.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.routes.js";


const app = express ();
const PORT = 8080;
//movimos el app.listen
const httpServer = app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`)
);

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

//routes
app.use('/api/carts', carts);
app.use('/api/products', products);
app.use('/', viewsRouter);

//instanciamos el manager

const productManager = new ProductManager('./Pre-entrega1/src/data/productos.json');

//el servidor recibe a const=products linea 15 del archivo main.js y crea el post
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    //recibimos el evento del archivo main.js
    socket.on("products_send", async (data) => {
        console.log(data);
        try {
            const products = new Product (
            data.title,
            data.description,
            data.price,
            data.thumbnail,
            data.code,
            data.stock,
            );
            await productManager.saveFile(products);// método del archivo ProductManager
            socket.emit("products", productManager.getProducts());// método del archivo ProductManager
        } catch (error) {
            console.log(error);
        }
    });

    socket.emit("products", productManager.getProducts()) //con este evento se envian todos los products y se obtiene del lado del cliente (main.js)
});
