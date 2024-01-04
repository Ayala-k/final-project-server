const nodemailer = require('nodemailer');
const { config } = require('../config/secret');

function sendEmail(to, subject, text, html) {
    // var transporter = nodemailer.createTransport({
    //     host: 'smtp.mailtrap.io',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: config.mailTrapUser,
    //         pass: config.mailTrapPass,
    //     },
    // });

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ayalakdeveloper@gmail.com',
      //pass: 'oiqrjowiichhpqni'
      pass:'tsypdaekqnienjyk'
    }
  })

    var mailOptions = {
        from: config.emailAddress,
        to: to,
        subject: subject,
        text: text,
        html:html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

    console.log("send demo email bachalomottt!!!");
}

exports.sendEmail = sendEmail;

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'ayalakdeveloper@gmail.com',
//       //pass: 'oiqrjowiichhpqni'
//       pass:'tsypdaekqnienjyk'
//     }
//   });
  
//   var mailOptions = {
//     from: 'ayalakdeveloper@gmail.com',
//     to: address,
//     subject: 'יצירת חשבון באתר הישראלי למעקב סכרת',
//     text: text
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });