import { Command } from 'commander';
import { getLogger } from './config/loggerConfig.js';

const logger = getLogger();


const program = new Command();

program
    .option('-d', 'Varaible para debug', false) //primero va la variable, luego la descripcion y al final puede ir un valor por defecto.
    .option('-p <port>', 'Puerto del servidor', 9090)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')

    .requiredOption('-u <user>', 'Usuario que va a utilizar el aplicativo.', 'No se ha declarado un usuario.');//RequireOption usa un mensaje por defecto si no está presente la opción.
program.parse(); //Parsea los comandos y valida si son correctos.

// console.log("Options: ", program.opts());
console.log("Modo Options: ", program.opts().mode);
console.log("Remaining arguments: ", program.args);

// Listeners
// es un entorno de ejecución de JavaScript basado en eventos. En Node.js, muchos objetos como los de red (HTTP, TCP, etc.), ficheros (streams de lectura/escritura), o incluso los procesos, emiten eventos. Los “listeners” son funciones que se asocian a estos eventos para reaccionar cuando ocurren.

// Por ejemplo, un servidor HTTP en Node.js emite un evento cada vez que hay una nueva solicitud entrante. Puedes asociar un “listener” a este evento para responder a la solicitud:


process.on("exit", code => { 
    logger.info("Este codigo se ejecuta antes de salir del proceso.");
    logger.info("Codigo de salida del proceso: " + code);
});

process.on("uncaughtException", exception => {
    logger.info("Esta exception no fue capturada, o controlada.");
    logger.info(`Exception no capturada: ${exception}`)
});

process.on("message", message => {
    logger.info("Este codigo se ejecutará cuando reciba un mensaje de otro proceso.");
    logger.info(`Mensaje recibido: ${message}`);
});



export default program;