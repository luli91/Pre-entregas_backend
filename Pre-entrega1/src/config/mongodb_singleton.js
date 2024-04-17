import mongoose from "mongoose";
import config from "./config.js";
// import { getLogger } from '../config/loggerConfig.js';

// const logger = getLogger();

export default class MongoSingleton {
    static #instance;


    constructor() {
        this.#connectMongoDB();
    }

    // Implementacon Singleton
    static getInstance() {
        if (this.#instance) {
            console.log("Ya se ha abierto una conexion a MongoDB.");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        console.log('Conectando a MongoDB...');
        try {
            await mongoose.connect(config.urlMongo);
            console.log("Conectado con exito a MongoDB usando Moongose.");

        } catch (error) {
            console.log("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();
        }
    }
};