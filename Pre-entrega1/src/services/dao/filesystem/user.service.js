import __dirname from '../../../dirname.js';
import fileSystem from 'fs';
import { getLogger } from '../../../config/loggerConfig.js';

const logger = getLogger();

export default class userService {
    #user;
    #dirPath;
    #filePath;
    #fileSystem;


    constructor() {
        this.#user = new Array();
        this.#dirPath = __dirname + '/files';
        this.#filePath = this.#dirPath + "/puser.json";
        this.#fileSystem = fileSystem;
    }

    #prepararDirectorioBase = async () => {
        //Creamos el directorio
        await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
        if (!this.#fileSystem.existsSync(this.#filePath)) {
            //Se crea el archivo vacio.
            await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
        }
    }

    save = async (user) => {
        logger.info("Guardar recurso:");
        logger.info(user);
        user.id = Math.floor(Math.random() * 20000 + 1);
        try {
            await this.#prepararDirectorioBase();
            this.#user = await this.getAll();
            this.#user.push(user);
            //Se sobreescribe el archivos de usuarios para persistencia.
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(this.#user));
            return user;

        } catch (error) {
            logger.error(`Error guardando recurso: ${JSON.stringify(userNuevo)}, detalle del error: ${error}`);
            throw Error(`Error guardando recurso: ${JSON.stringify(userNuevo)}, detalle del error: ${error}`);
        }
    }

    getAll = async () => {
        try {
            //Validamos que exista ya el archivo con usuarios sino se crea vacío para ingresar nuevos:
            await this.#prepararDirectorioBase();
            //leemos el archivo
            let data = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            //Cargamos los usero encontrados para agregar el nuevo:
            //Obtenemos el JSON String 
            //console.info("Archivo JSON obtenido desde archivo: ");
            logger.info(data);
            this.#user = JSON.parse(data);
            logger.info("Productos encontrados: ");
            logger.info(this.#user);
            return this.#user;
        } catch (error) {
            logger.error(`Error consultando los puser por archivo, valide el archivo: ${this.#dirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los puser por archivo, valide el archivo: ${this.#dirPath},
            detalle del error: ${error}`);
        }
    }
};