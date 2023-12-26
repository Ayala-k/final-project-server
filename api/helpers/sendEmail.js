const nodemailer = require('nodemailer');

exports.sendEmail = async () => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '2f89c7be77d8e6',
            pass: '3fb6b0235e543c',
        },
    });

    // Set up email data
    const mailOptions = {
        from: 'kluftayala@gmail.com', // sender address
        to: 'tamarcohen32@gmail.com', // list of receivers
        subject: 'Hello:)', // Subject line
        text: 'Hello, this is a test email!', // plain text body
        html: '<b>Hello, this is a test email!</b>', // html body
    };

    // Send mail with defined transport object
    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    //     console.log('Message sent: %s', info.messageId);
    //   });

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }

}

