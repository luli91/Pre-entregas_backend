import config from '../config/config.js';
import MongoSingleton from '../config/mongodb_singleton.js';

let userService;

async function initializeMongoService() {
    console.log("Iniciando Servicio para Mongo!!");
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}

async function initializeUserService() {
    switch (config.persistence) {
        case 'mongodb':
            await initializeMongoService();
            const { default: UserServiceMongo } = await import('./dao/mongo/user.service.js')
            userService = new UserServiceMongo();
            console.log("Servicio de usuarios cargado:");
            console.log(userService);
            break;

        case 'file':
            // IMPORTARME le DAO
            const { default: UserServiceFileSystem } = await import('./dao/filesystem/user.service.js')
            userService = new UserServiceFileSystem();
            console.log("Servicio de usuarios cargado:");
            console.log(userService);
            break;

        default:
            console.error("Persistencia no válida en la configuración:", config.persistence);
            process.exit(1); // Salir con código de error
            break;
    }
}

initializeUserService();

export { userService };