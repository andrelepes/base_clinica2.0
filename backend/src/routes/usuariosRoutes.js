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
router.get('/:id', UserController.getUserById); // Utilizando a função getUserById do controller
router.post('/add-linked-psychologist', UserController.addLinkedPsychologist);
router.get('/linked-psychologists/:clinicaId', UserController.getLinkedPsychologists);
router.put('/update-status/:usuario_id', UserController.updateStatus);
router.post('/add-linked-secretary', UserController.addLinkedSecretary); // Adicionar um secretário vinculado
router.get('/linked-secretaries/:clinicaId', UserController.getLinkedSecretaries); // Obter secretários vinculados a uma clínica específica

module.exports = router;