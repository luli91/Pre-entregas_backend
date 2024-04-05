import nodemailer from 'nodemailer';
import config from '../config/config.js';
import { getLogger } from '../config/loggerConfig.js';

const logger = getLogger();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
});

transporter.verify(function (error, success) {
    if (error) {
        logger.error(error);
    } else {
        logger.info('Server is ready to take our messages');
    }
});

export const mensajeCompra = (username, total, code) => {
    return `
    Hola ${username},

    Gracias por tu compra. El total de tu compra fue ${total}. Tu código de confirmación es ${code}.

    ¡Gracias por comprar con nosotros!

    Saludos,
    Tu equipo
    `;
};

export const sendEmail = (to, subject, html, res) => {
    try {
        const mailOptions = {
            from: "Coder Test - " + config.gmailAccount,
            to: to,
            subject: subject,
            html: html,
        };

        // Envía el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error('Error al enviar el correo:', error);
                res.status(500).json({ error: 'Hubo un error al enviar el correo' });
            } else {
                logger.info('Correo enviado:', info.response);
                res.json({ message: 'Correo enviado correctamente' });
            }
        });
    } catch (error) {
        logger.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Hubo un error al enviar el correo' });
    }
};
