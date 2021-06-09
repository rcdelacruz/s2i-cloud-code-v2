/*
* this should be part of s2i
*/
//const path = require("path");
const mailAdapter = require('./adapter');

Parse.Cloud.define("sendMail", (req, res) => {
  //console.log(req.params.to);
  mailAdapter.adapter.sendMail({
      from: process.env.EMAIL_FROM_ADDRESS,
      to: req.params.to,//'rdelacruz@stratpoint.com', // "foo <foo@example.com>"
      subject: req.params.subject, //'this is a subject', // email subject
      template: req.params.templatePath, //'./public/files/templates/verifyUser.html',
      templateData: req.params.templateData
    })
    .then(info => console.log("success"))
    .catch(err => console.log(err));
});