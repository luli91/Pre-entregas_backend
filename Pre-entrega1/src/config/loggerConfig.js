import winston from "winston";

// Define los niveles de loggeo
const customLevelsOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warn: 'yellow',
        error: 'magenta',
        fatal: 'red'
    }
};

winston.addColors(customLevelsOptions.colors);

// Crea el logger para desarrollo
export const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

// Crea el logger para producción
export const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

export function getLogger() {
    return process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
}

// Usa getLogger para obtener el logger correcto
const logger = getLogger();

