import express from 'express';
import carts from "./routes/carts.js";
import products from "./routes/products.js";
import handlebars from "express-handlebars";
import viewRouter from "./routes/views.routes.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";


const app = express ();
const PORT = 8080;
//movimos el app.listen
const httpServer = app.listen(PORT, () =>
    console.log(`Server listening on port ${PORT}`)
);

// Instanciar Websocket
//creamos un servidor para sockets viviendo dentro de nuestro servidor principal
const socketServer = new Server(httpServer);

// Middlewares
app.use(express.json())
app.use (express.urlencoded({extended: true}));

// Configuramos el motor de plantilla
app.engine('hbs', handlebars.engine({
    extname: 'hbs',//el nombre del archivo lo definimos acá. porej: index.hbs
    defaultlayout: 'main' //toma la plantilla principal
}))

//seteamos el motor
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//public
app.use(express.static(`${__dirname}/public`));

// //ruta principal

// app.get("/", (req, res) =>{
//     res.json({
//         mensaje:"Bienvenidos a Only Books"
//     });
// });

//routes
app.use('/api/carts', carts);

app.use('/api/products', products);

app.use("/", viewRouter);

app.get("/", (req, res) => {
    // aca puedo leer los productos del archivo JSON
    const products = readProductsFromFile();
    res.render('home', { products: products });
});


socketServer.on("connection", (socketClient) => {
    console.log("Nuevo cliente conectado");

    socketClient.on('new product', (product) => {
        console.log('new product: ' + product);
      // Aquí puedes emitir el nuevo producto a todos los clientes conectados
        socketServer.emit('new product', product);
    });

    socketClient.on('delete product', (productId) => {
        console.log('delete product: ' + productId);
      // Aquí puedes emitir la eliminación del producto a todos los clientes conectados
        socketServer.emit('delete product', productId);
    });
});

