import express from 'express';
//import carts from "./routes/carts.js";
import products from "./routes/products.js"

const app = express ();

app.use(express.json())
app.use (express.urlencoded({extended: true}));

//ruta principal

app.get("/", (req, res) =>{
    res.json({
        mensaje:"Bienvenidos a Only Books"
    });
});

//router
// app.use('/api/carts', carts)
app.use('/api/products', products)

app.listen(8080, () => console.log("Server listening on port 8080"));