const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const { mailConfig } = require('../config/mail');
const fs = require('fs');

const transporter = nodemailer.createTransport(mailConfig);

const sendMail = async ({ to, subject, variables, path }) => {
  const templateFileContent = fs.readFileSync(path).toString('utf-8');

  const templateParse = handlebars.compile(templateFileContent);

  const templateHTML = templateParse(variables);

  const message = await transporter.sendMail({
    to,
    from: 'Base Clínica <noreply@baseclinica.com.br',
    subject,
    html: templateHTML,
  });

  console.log('Message sent: %s', message.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
};

module.exports = { sendMail };
