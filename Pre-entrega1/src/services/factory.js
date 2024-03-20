import config from '../config/config.js';
import MongoSingleton from '../config/mongodb_singleton.js';
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();


let userService;

async function initializeMongoService() {
    logger.info("Iniciando Servicio para Mongo!!");
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        logger.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}

async function initializeUserService() {
    switch (config.persistence) {
        case 'mongodb':
            await initializeMongoService();
            const { default: UserServiceMongo } = await import('./dao/mongo/user.service.js')
            userService = new UserServiceMongo();
            logger.info("Servicio de usuarios cargado:");
            logger.info(userService);
            break;

        case 'file':
            // IMPORTARME le DAO
            const { default: UserServiceFileSystem } = await import('./dao/filesystem/user.service.js')
            userService = new UserServiceFileSystem();
            logger.info("Servicio de usuarios cargado:");
            logger.info(userService);
            break;

        default:
            logger.error("Persistencia no válida en la configuración:", config.persistence);
            process.exit(1); // Salir con código de error
            break;
    }
}

initializeUserService();

export { userService };