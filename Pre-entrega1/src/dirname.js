import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//createHash- Aplicara el hash al password
//isValidPassword - Compara el password que coloca el cliente con la que guardo en la base de datos

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>{
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password);
    
}

export { __dirname };