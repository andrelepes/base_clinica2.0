const express = require('express');
const router = express.Router();
const Usuarios = require('../models/Usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../database'); // Adicionei esta linha para o acesso ao banco de dados
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
        const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Senha inválida' });
        }

        const payload = {
            user: {
                id: usuario.id,
                tipoUsuario: usuario.tipoUsuario,
                clinica_id: usuario.clinica_id
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });

        res.json({ message: 'Login bem-sucedido', token: token, nome: usuario.nome }); // Nome incluído
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});
// Registrar novo usuário
router.post('/registrar', async (req, res) => {
    console.log("Corpo da requisição:", req.body);
    const { nome, email, senha, tipoUsuario, clinica_id } = req.body;

    if (!nome || !email || !senha || !tipoUsuario || !clinica_id) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    try {
        if (await Usuarios.emailJaRegistrado(email)) {
            return res.status(400).json({ message: 'E-mail já registrado' });
        }


        // Criptografe a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        await Usuarios.inserirUsuario(nome, email, senhaCriptografada, tipoUsuario, clinica_id);

        // Insira o novo usuário no banco de dados
        await db.none('INSERT INTO usuarios (nome, email, senha, tipoUsuario, clinica_id) VALUES ($1, $2, $3, $4, $5)',
            [nome, email, senhaCriptografada, tipoUsuario, clinica_id]);

        // Criar token JWT com informações adicionais
        const payload = {
            user: {
                id: email,
                nome: nome,
                tipoUsuario: tipoUsuario,
                clinica_id: clinica_id
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Usuário registrado com sucesso!', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});
// Solicitar Recuperação de Senha
router.post('/solicitar-recuperacao-senha', async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await db.oneOrNone('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Gere um token de redefinição de senha
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000; 

        // Atualize o usuário no banco de dados com o token e a data de expiração
        await db.none('UPDATE usuarios SET resetToken = $1, resetTokenExpiration = $2 WHERE id = $3', [resetToken, resetTokenExpiration, usuario.id]);

        // Envie o token por e-mail para o usuário
        await sendEmail(email, 'Recuperação de Senha', `Seu token é: ${resetToken}`);

        res.json({ message: 'E-mail de recuperação enviado!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;
