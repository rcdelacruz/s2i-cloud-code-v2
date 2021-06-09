/*
* this should be part of s2i
*/
const path = require("path");

//adapter options
const options = {
    // ... nodemailer options,
    from: process.env.EMAIL_FROM_ADDRESS,
    pool: true,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SLL, // use TLS
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
  };
  
  //import the module and pass the options
  const adapter = require('parse-server-email-template-adapter')({...options});
  
  //export the options to be used in the parse server config
  //export the sendMail function to be used in sending emails in cloud code
  module.exports = {
    adapter,
    options
  };