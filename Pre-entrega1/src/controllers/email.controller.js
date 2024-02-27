import nodemailer from 'nodemailer';
import config from '../config/config.js';
import{ __dirname} from '../dirname.js'


// configuracion de transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})

// Verificamos conexion con gmail
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})

//configuracion de mailoption
const mailOptions = {
    from: "Coder Test - " + config.gmailAccount,
    to: 'cynthia.medina.diaz@gmail.com',//correo del usuario
    subject: "Correo de prueba CoderHouse Pkrogramacion BackEnmd clase30",
    html: `<div><h1> Esto es un test de correo con NodeMailer </h1></div>`,
    attachments: []
}

//email con imagen 
const mailOptionsWithAttachments = {
    from: "Coder Test - " + config.gmailAccount,
    to: `${config.gmailAccount};cynthia.medina.diaz@gmail.com`,
    subject: "Correo de prueba CoderHouse Pkrogramacion BackEnmd clase30",
    html: `<div>
                <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="cid:meme"/>
            </div>`,
    attachments: [
        {
            filename: 'Meme de programacion',
            path: __dirname + '/public/images/meme.jpeg',
            cid: 'meme'
        }
    ]
}

//enviar mail- 
export const sendEmail = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}


export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            }
            console.log('Message sent: %s', info.messageId);
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
}