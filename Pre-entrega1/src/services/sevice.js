import UserServiceDao from "./dao/mongo/user.service.js";


import UserRepository from './repository/user.repository.js'


// Generamos las instancias de las clases
const userDao = new UserServiceDao()


export const userService = new UserRepository(userDao);
