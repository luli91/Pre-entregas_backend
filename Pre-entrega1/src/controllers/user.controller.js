// Para trabajar Factory
//import { userService } from '../services/factory.js';

// Para trabajar Repository
import { userService } from '../services/sevice.js';
import UserDto from '../services/dto/user.dto.js';

//para utilizar faker
import { generateUser } from '../dirname.js';

export async function getAllUser(req, res) {
    try {
        let user = await userService.getAll();
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios." });
    }
}


export async function saveUser(req, res) {
    try {
        const userDto = new UserDto(req.body);
        let result = await userService.save(userDto);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo guardar el usuario." });
    }
}; 

export const getUsers = async (req, res) => {
    try {
        let users = [];
        for (let i = 0; i < 5; i++) {
            users.push(generateUser());
        }
        res.send({ status: "success", payload: users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los usuarios:" });
    }
};