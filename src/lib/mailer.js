const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: process.env.NODE_MAILER_HOST,
  port: process.env.NODE_MAILER_PORT,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
});
