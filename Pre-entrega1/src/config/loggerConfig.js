import winston from "winston";

// Define los niveles de loggeo
const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5
};

// Define los colores para cada nivel
const colors = {
    fatal: 'red',
    error: 'magenta',
    warn: 'yellow',
    info: 'blue',
    http: 'purple',
    debug: 'white'
};

winston.addColors(colors);

// Crea el logger para desarrollo
export const devLogger = winston.createLogger({
    levels,
    format: winston.format.combine(
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' })
    ]
});

// Crea el logger para producción
export const prodLogger = winston.createLogger({
    levels,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});

export function getLogger() {
    return process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
    }