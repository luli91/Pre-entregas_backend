import mongoose from "mongoose";
import config from "./config.js";
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

export default class MongoSingleton {
    static #instance;


    constructor() {
        this.#connectMongoDB();
    }

    // Implementacon Singleton
    static getInstance() {
        if (this.#instance) {
            logger.info("Ya se ha abierto una conexion a MongoDB.");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.urlMongo);
            logger.info("Conectado con exito a MongoDB usando Moongose.");

        } catch (error) {
            console.error("No se pudo conectar a la BD usando Moongose: " + error);
            process.exit();
        }
    }
};