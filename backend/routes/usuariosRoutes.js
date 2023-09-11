const express = require('express');
const router = express.Router();
const UserController = require('../controllers/usuariosController'); // Importando o controller
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração do Nodemailer com OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: process.env.EMAIL_ACCESS_TOKEN
    }
});

// Função sendEmail
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: 'prof.andrelepesqueur@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}

// Rotas
router.post('/login', UserController.login); // Utilizando a função login do controller
router.post('/registrar', UserController.register); // Utilizando a função register do controller
router.post('/solicitar-recuperacao-senha', UserController.forgotPassword); // Utilizando a função forgotPassword do controller

module.exports = router;