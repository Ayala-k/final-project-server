const nodemailer = require('nodemailer');

function sendEmail(to, subject, text) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
            user: '2f89c7be77d8e6',
            pass: '3fb6b0235e543c',
        },
    });

    var mailOptions = {
        from: 'ayalakdeveloper@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendEmail = sendEmail;