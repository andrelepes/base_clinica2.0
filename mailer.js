const nodemailer = require('nodemailer');

const createTransporter = async () => {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USER,
            clientId: process.env.MAIL_CLIENT_ID,
            clientSecret: process.env.MAIL_CLIENT_SECRET,
            refreshToken: process.env.MAIL_REFRESH_TOKEN,
            accessToken: process.env.MAIL_ACCESS_TOKEN,
            expires: 1484314697598  // Isso parece ser um valor fixo. Se ele mudar, você também deve mover para as variáveis de ambiente.
        }
    });
};

const sendEmail = async (to, subject, text) => {
    let transporter = await createTransporter();

    let info = await transporter.sendMail({
        from: `"Clinica Psicologia" <${process.env.MAIL_USER}>`, // atualizado para usar a variável de ambiente
        to: to,
        subject: subject,
        text: text
    });

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
