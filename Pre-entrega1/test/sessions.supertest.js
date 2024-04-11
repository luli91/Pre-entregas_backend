import supertest from 'supertest';
import app from '../../Pre-entrega1/src/server.js';

const requester = supertest.agent(app);

describe('Session route', () => {
  let token; // almacena el token de autenticación del usuario

    before(async () => {
    // crea un usuario de prueba y obtiene su token de autenticación
        const user = { 
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword' 
        };
        let res = await requester.post('/users').send(user);
        expect(res.statusCode).to.equal(200);

        const credentials = { 
        email: 'testuser@example.com',
        password: 'testpassword' 
        };
        res = await requester.post('/login').send(credentials);
        expect(res.statusCode).to.equal(200);
        token = res.body.token; // guarda el token para usarlo en las pruebas
    });

    it('should return Bienvenido!! for the first visit', async () => {
        const res = await requester.get('/session').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Bienvenido!!');
    });

    it('should return Se ha visitado este sitio 2 veces. for the second visit', async () => {
        await requester.get('/session').set('Authorization', `Bearer ${token}`);
        const res = await requester.get('/session').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Se ha visitado este sitio 2 veces.');
    });

    after(async () => {
    // elimina el usuario de prueba después de todas las pruebas
        const res = await requester.delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).to.equal(200);
    });
});



//npx mocha Pre-entrega1/test/sessions.supertest.js