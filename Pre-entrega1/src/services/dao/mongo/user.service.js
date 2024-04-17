import userModel from "./models/user.js";
import { getLogger } from '../../../config/loggerConfig.js';

const logger = getLogger();


export default class UserServiceMongo {
    constructor() {
        logger.info("Working users with Database persistence in mongodb");
    }

    getAll = async () => {
        console.log('Intentando obtener todos los usuarios...');
        let user = await userModel.find();
        console.log('Usuarios obtenidos:', user);
        return user.map(user => user.toObject());
    }
    save = async (user) => {
        let result = await userModel.create(user);
        return result;
    }

    findByUsername = async (username) => {
        const result = await userModel.findOne({ email: username });
        return result;
    };

    update = async (filter, value) => {
        logger.info("Update student with filter and value:");
        logger.info(filter);
        logger.info(value);
        let result = await userModel.updateOne(filter, value);
        return result;
    }
}