const express = require('express');
const router = express.Router();
const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../../database'); // Adicionei esta linha para o acesso ao banco de dados
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

// Rota de Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email_usuario = $1', [email]);
                if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Senha inválida' });
        }

        const payload = {
            const payload = {
                user: {
                    id: usuario.usuario_id,
                    tipousuario: usuario.tipousuario,
                    clinica_id: usuario.clinica_id           
                }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });

        res.json({ message: 'Login bem-sucedido', token: token, nome: usuario.nome_usuario });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});
// Registrar novo usuário
router.post('/registrar', async (req, res) => {
    console.log("Corpo da requisição:", req.body);
    const { nome_usuario, email_usuario, senha, tipousuario, clinica_id } = req.body;

    // Validação de campos obrigatórios
    if (!nome_usuario || !email_usuario || !senha || !tipousuario) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    try {
        // Criptografe a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        let clinicaIdToUse = clinica_id;

        // Se o usuário é uma clínica, crie um novo clinica_id
        if (tipousuario === 'Clinica' && !clinica_id) {
            const novaClinica = await db.one('INSERT INTO clinicas (nome_usuario, email_usuario, tipoUsuario) VALUES ($1, $2, $3) RETURNING id', [nome_usuario, email_usuario, tipousuario]);
            clinicaIdToUse = novaClinica.id;
        }

        // Use a função inserirUsuario para inserir o novo usuário
        const resultado = await Usuarios.inserirUsuario(nome_usuario, email_usuario, senhaCriptografada, tipousuario, clinicaIdToUse);

        if (resultado.success) {
            // Criar token JWT com informações adicionais
            const payload = {
                user: {
                    id: usuario.usuario_id, // Atualizado para o novo nome da coluna
                    nome: nome_usuario, // Atualizado para o novo nome da coluna
                    tipousuario: tipousuario,
                    clinica_id: clinicaIdToUse
                            }
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

            res.json({ message: resultado.message, token: token });
        } else {
            res.status(500).json({ message: resultado.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

// Solicitar Recuperação de Senha
router.post('/solicitar-recuperacao-senha', async (req, res) => {
    const { email_usuario } = req.body;

    try {
        const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email_usuario = $1', [email_usuario]);
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Gere um token de redefinição de senha
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; 

        // Atualize o usuário no banco de dados com o token e a data de expiração
        await db.none('UPDATE usuarios SET resetToken = $1, resetTokenExpiration = $2 WHERE usuario_id = $3', [resetToken, resetTokenExpiration, usuario.usuario_id]);

        // Envie o token por e-mail para o usuário
        await sendEmail(email_usuario, 'Recuperação de Senha', `Seu token é: ${resetToken}`);

        res.json({ message: 'E-mail de recuperação enviado!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
