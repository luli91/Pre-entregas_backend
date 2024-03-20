import { devLogger, prodLogger } from './loggerConfig.js';
import config from './config.js';

// Selecciona el logger dependiendo del entorno
export const logger = config.environment === 'production' ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {

    req.logger = logger;

  // Agrega logs de alto valor
    req.logger.warn(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

    next();
};
