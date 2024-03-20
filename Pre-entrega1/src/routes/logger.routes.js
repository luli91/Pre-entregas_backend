import { Router } from "express";
import { getLogger } from '../config/loggerConfig.js';

const router = Router();
const logger = getLogger();

router.get('/loggerTest', (req, res) => {
    logger.fatal('Mensaje de nivel fatal');
    logger.error('Mensaje de nivel error');
    logger.warning('Mensaje de nivel warning');
    logger.info('Mensaje de nivel info');
    logger.http('Mensaje de nivel http');
    logger.debug('Mensaje de nivel debug');

    res.send('Mensajes de loggeo enviados. Revisa tu consola o archivo de logs.');
});

export default router;
