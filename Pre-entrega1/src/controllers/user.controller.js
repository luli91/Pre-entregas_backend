// Para trabajar Factory
//import { userService } from '../services/factory.js';

// Para trabajar Repository
import { userService } from '../services/sevice.js';
//import UserDto from '../services/dto/user.dto.js';

//para utilizar faker
//import { generateUser } from '../dirname.js';

//agregue
import CustomError from "../services/errors/custom.errors.js";
import EErrors from "../services/errors/errors-enum.js";
import { generateUserErrorInfo } from "../services/errors/messages/user-creation-error.message.js";
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

const users = [];

export const getUsers = (req, res) => {
    try {
        res.send({ message: "Success!", payload: users });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios." });
    }

}

export async function getAllUser(req, res) {
    try {
        let user = await userService.getAll();
        res.send(user);
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios." });
    }
}

export const saveUser = (req, res) => {
    try {

        const { first_name, last_name, age, email } = req.body;

        //respuesta de error!
        //TODO:: Create Custom Error
        if (!first_name || !email) {
            // Creamos un Custom Error
            CustomError.createError({
                name: "User Create Error",
                cause: generateUserErrorInfo({ first_name, last_name, age, email }),
                message: "Error tratando de crear al usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }


        // Si todo esta bien, armamos un DTO con la data ya controlada
        const userDto = {
            first_name,
            last_name,
            age,
            email
        }
        if (users.length === 0) {
            userDto.id = 1;
        } else {
            userDto.id = users[users.length - 1].id + 1;
        }
        users.push(userDto);
        res.status(201).send({ status: "success", payload: userDto });

    } catch (error) {
        logger.error(error.cause);
        res.status(500).send({ error: error.code, message: error.message });
    }
}

// export async function saveUser(req, res) {
//     try {
//         const userDto = new UserDto(req.body);
//         let result = await userService.save(userDto);
//         res.status(201).send(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: error, message: "No se pudo guardar el usuario." });
//     }
// }; 

// export const getUsers = async (req, res) => {
//     try {
//         let users = [];
//         for (let i = 0; i < 5; i++) {
//             users.push(generateUser());
//         }
//         res.send({ status: "success", payload: users });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: error, message: "No se pudo obtener los usuarios:" });
//     }
// };