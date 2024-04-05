import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API Adopme",
            version: "1.0.0",
            description: "Documentacion para uso de swagger",
        },
        tags: [
            {
                name: "products",
                description: "Productos de la tienda"
            },
            {
                name: "carts",
                description: "Carritos de compras de la tienda"
            }
        ],
    },
    apis: [`./Pre-entrega1/src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

export default specs;