import dotenv from 'dotenv';
import { Command } from 'commander';
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

const program = new Command(); //Crea la instancia de comandos de commander.

program
    .option('-d', 'Variable para debug', false)
    .option('--persist <persist>', 'Modo de persistencia', "mongodb")
    .option('--mode <mode>', 'Modo de trabajo', 'dev')
program.parse();

logger.info("Environment Mode Option: ", program.opts().mode);
logger.info("Persistence Mode Option: ", program.opts().persist);

const environment = program.opts().mode;

dotenv.config({
    path: environment === "prod" ? "./src/config/.env.production" : "./src/config/.env.development"
});

logger.info("PERSISTENCE:::");
logger.info(program.opts().persist);

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
};