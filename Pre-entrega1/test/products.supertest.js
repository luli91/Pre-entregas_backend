import supertest from 'supertest';
import app from '../../Pre-entrega1/src/server.js';

const requester = supertest(app);

describe('Product Routes', () => {
    let productId; //almacena el ID del producto creado

    const newProduct = { 
        title: 'Producto de prueba',
        description: 'Este es un producto de prueba',
        price: 100,
        thumbnail: 'url-de-la-imagen',
        code: 'codigo-de-prueba',
        stock: 10,
        category: 'categoria-de-prueba',
        owner: 'id-del-usuario' 
    };
    const updatedData = { 
        title: 'Producto de prueba actualizado',
        description: 'Este es un producto de prueba actualizado',
        price: 150,
        thumbnail: 'url-de-la-imagen-actualizada',
        code: 'codigo-de-prueba-actualizado',
        stock: 15,
        category: 'categoria-de-prueba-actualizada',
        owner: 'id-del-usuario' // Actualiza esto con un ID de usuario válido
    };

    beforeEach(async (done) => {
        // crea un nuevo producto antes de cada prueba
        requester
            .post('/')
            .send(newProduct)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                productId = res.body._id; // guarda el ID del producto para usarlo en las siguientes pruebas
                done();
            });
    });

    it('should get a product by id', (done) => {
        requester
            .get(`/ruta-del-producto/${productId}`)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should get all products', (done) => {
        requester
            .get('/products')
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should create a new product', (done) => {
        requester
            .post('/')
            .send(newProduct)
            .expect(200) 
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should update a product', (done) => {
        requester
            .put(`/${productId}`)
            .send(updatedData)
            .expect(200) // Aserción de supertest
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    it('should delete a product', (done) => {
        requester
            .delete(`/${productId}`)
            .expect(200) // Aserción de supertest
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    afterEach(async (done) => {
        // Elimina el producto después de cada prueba
        requester
            .delete(`/${productId}`)
            .expect(200) // Aserción de supertest
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});
