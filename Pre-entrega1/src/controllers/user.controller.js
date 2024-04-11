import { userService } from '../services/sevice.js';
import CustomError from "../services/errors/custom.errors.js";
import EErrors from "../services/errors/errors-enum.js";
import { generateUserErrorInfo } from "../services/errors/messages/user-creation-error.message.js";
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.send({ status: "success", payload: users });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios." });
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        res.send({ status: "success", payload: user });
    } catch (error) {
        logger.error(error);
        res.status(404).send({ status: "error", error: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { first_name, last_name, age, email } = req.body;
        const userId = req.params.uid;
        if (!first_name || !email) {
            // Creamos un Custom Error
            CustomError.createError({
                name: "User Update Error",
                cause: generateUserErrorInfo({ first_name, last_name, age, email }),
                message: "Error tratando de actualizar al usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        const userDto = {
            first_name,
            last_name,
            age,
            email
        }
        const user = await userService.update(userId, userDto);
        res.status(200).send({ status: "success", payload: user });
    } catch (error) {
        logger.error(error.cause);
        res.status(500).send({ error: error.code, message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const result = await userService.delete(userId);
        res.send({ status: "success", message: "User deleted" });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ error: error, message: "No se pudo eliminar el usuario." });
    }
}

export const saveUser = async (req, res) => {
    try {
        const { first_name, last_name, age, email } = req.body;
        if (!first_name || !email) {
            // Creamos un Custom Error
            CustomError.createError({
                name: "User Create Error",
                cause: generateUserErrorInfo({ first_name, last_name, age, email }),
                message: "Error tratando de crear al usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        const userDto = {
            first_name,
            last_name,
            age,
            email
        }
        const user = await userService.save(userDto); // Usa el método save del servicio
        res.status(201).send({ status: "success", payload: user });
    } catch (error) {
        logger.error(error.cause);
        res.status(500).send({ error: error.code, message: error.message });
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    saveUser
}