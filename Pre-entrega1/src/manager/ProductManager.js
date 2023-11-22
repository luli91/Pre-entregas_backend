import fs from 'fs';

export default class ProductManager{
    constructor (path) {
        this.path = path;
        this.products = [];
        this.currentId = 1;
        if(fs.existsSync(path)){
            try{
                let products= fs.readFileSync(path, "utf8");
                this.products = JSON.parse(products); 
            } catch (error) {
                this.products = [];
                
            }
        } else {
            this.products = [];
            fs.writeFileSync(path, JSON.stringify(this.products, null, "\t"));
        }
    }

    async saveFile(data) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

    const existingProduct = this.products.find(existingProduct => existingProduct.code === product.code);

    if (existingProduct) {
        console.error("El producto ya existe");
        return;
    }

        product.id = this.currentId++;
        this.products.push(product);
        console.log(this.products)
        const respuesta = await this.saveFile(this.products);
        return respuesta;
    }

    getProducts() {
        // console.log(this.products);
        return this.products;
    }

    getProductById(id) {
        for (let product of this.products) {
            if (product.id === id) {
                return product;
            }
        }
        console.error("Producto no encontrado");
    }

async updateProduct(id, newProduct) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
        console.error("Producto no encontrado");
        return;
    }


    if (newProduct.code && this.products.some(existingProduct => existingProduct.code === newProduct.code && existingProduct.id !== id)) {
        console.error("El código del producto ya existe");
        return;
    }

    this.products[productIndex] = { 
        ...this.products[productIndex],
        ...newProduct,
        id: this.products[productIndex].id, 
        code: this.products[productIndex].code 
    };
    
    const respuesta = await this.saveFile(this.products);
    return respuesta;
}

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            console.error("Producto no encontrado");
            return;
        }
        
        this.products.splice(productIndex, 1);

        const respuesta = await this.saveFile(this.products);
        return respuesta;
    }
    
}


class Product{
    constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail= thumbnail;
    this.code =code;
    this.stock = stock;
    }
}

// Creo una instancia de la clase ProductManager
const productManager = new ProductManager('./Pre-entrega1/src/data/productos.json');


// (async () => { 
//     // Llamo a addProduct
//     await productManager.addProduct({
//         title: "El duque y yo",
//         description: "libro Julia Quinn",
//         price: 11115,
//         thumbnail: "https://http2.mlstatic.com/D_NQ_NP_766649-MLA44209854761_112020-O.webp",
//         code: "abcd123",
//         stock: 5
//     });

//     await productManager.addProduct({
//         title: "Forastera de Diana Gabaldon",
//         description: "libro saga 1",
//         price: 11699,
//         thumbnail: "https://www.penguinlibros.com/ar/2133507-thickbox_default/forastera-saga-claire-randall-1.jpg",
//         code: "abc123",
//         stock: 5
//     });

//     await productManager.addProduct({
//         title: "Atrapada en el tiempo",
//         description: "libro saga 2",
//         price: 17.699,
//         thumbnail: "https://www.penguinlibros.com/ar/2133493-thickbox_default/atrapada-en-el-tiempo-saga-claire-randall-2.jpg",
//         code: "abc1234",
//         stock: 10
//     });

//     await productManager.addProduct({
//         title: "Viajera",
//         description: "libro saga 3",
//         price: 22.599,
//         thumbnail: "https://www.penguinlibros.com/ar/2133494-thickbox_default/viajera-saga-claire-randall-3.jpg",
//         code: "abc12345",
//         stock: 8
//     });
//     await productManager.addProduct({
//         title: "Tambores de otoño",
//         description: "libro saga 4",
//         price: 20.599,
//         thumbnail: "https://www.penguinlibros.com/ar/2133487-home_default/tambores-de-otono-saga-claire-randall-4.webp",
//         code: "ab123",
//         stock: 10
//     });

    
//     await productManager.addProduct({
//         title: "La cruz ardiente",
//         description: "libro saga 5",
//         price: 23.599,
//         thumbnail: "https://www.penguinlibros.com/ar/2133484-home_default/la-cruz-ardiente-saga-outlander-5.webp",
//         code: "ab1234",
//         stock: 8
//     });

//     await productManager.addProduct({
//         title: "Viento y ceniza",
//         description: "libro saga 6",
//         price: 21.899,
//         thumbnail: "https://www.penguinlibros.com/ar/2133501-home_default/viento-y-ceniza-saga-claire-randall-6.webp",
//         code: "ab12345",
//         stock: 6
//     });

//     await productManager.addProduct({
//         title: "Ecos del pasado",
//         description: "libro saga 7",
//         price: 19.399,
//         thumbnail: "https://www.penguinlibros.com/ar/2133502-home_default/ecos-del-pasado-saga-claire-randall-7.webp",
//         code: "a1234",
//         stock: 2
//     });

//     await productManager.addProduct({
//         title: "50 sombras de grey",
//         description: "saga 1",
//         price: 26784,
//         thumbnail: "https://www.penguinlibros.com/ar/2131763-thickbox_default/cincuenta-sombras-de-grey-cincuenta-sombras-1.jpg",
//         code: "def123",
//         stock: 2
//     });

//     await productManager.addProduct({
//         title: "Cincuenta sombras liberadas",
//         description: "saga 2",
//         price: 15648,
//         thumbnail: "https://www.penguinlibros.com/ar/1648981-large_default/cincuenta-sombras-liberadas.webp",
//         code: "de123",
//         stock: 2
//     });

//     await productManager.addProduct({
//         title: "Harry Potter y el legado maldito",
//         description: "libro saga 8",
//         price: 22.099,
//         thumbnail: "https://www.penguinlibros.com/ar/2126891-thickbox_default/harry-potter-y-el-legado-maldito-harry-potter-8.jpg",
//         code: "a123",
//         stock: 7
//     });
//     await productManager.updateProduct(8, {
//         title: "Escrito con la sangre de mi corazon",
//         description: "libro saga 8",
//         price: 22.899,
//         thumbnail: "https://www.penguinlibros.com/ar/2133513-home_default/escrito-con-la-sangre-de-mi-corazon-saga-outlander-8.webp",
//         code: "a12345",
//         stock: 3
//     });

//     // Llamo a deleteProduct
//     await productManager.deleteProduct(1);

// });