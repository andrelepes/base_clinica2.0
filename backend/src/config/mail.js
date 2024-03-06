var mailConfig;
if (process.env.NODE_ENV === 'production') {
  mailConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
} else {
  mailConfig = {
    host: process.env.SMTP_HOST_DEV,
    port: process.env.SMTP_PORT_DEV,
    auth: {
      user: process.env.SMTP_USER_DEV,
      pass: process.env.SMTP_PASS_DEV,
    },
  };
}

module.exports = { mailConfig };
