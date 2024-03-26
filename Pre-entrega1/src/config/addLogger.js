import { getLogger } from './loggerConfig.js';

export const addLogger = (req, res, next) => {
  // Asegúrate de que req.logger está definido
  req.logger = getLogger();

  if (typeof req.logger.warn !== 'function') {
      throw new Error('req.logger.warn is not a function');
  }

  req.logger.warn(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
  req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
  req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
  req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);

  next();
};