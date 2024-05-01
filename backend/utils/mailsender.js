const nodemailer = require('nodemailer');
require("dotenv").config()
exports.mailSender = async (email,title,body) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: 'app.chaty.mail@gmail.com',
                pass: 'vust zywf qfgu loer'
            }

        })

        const info = await transporter.sendMail({
            from: "SudyNotion",
            to: `${email}`,
            subject: title,
            html: `${body}`
        });
        console.log(info)
        return info;
    } catch (error) {
        console.log(error);
    }
}


// var nodemailer = require('nodemailer');

// // Create the transporter with the required configuration for Outlook
// // change the user and pass !
// var transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com", // hostname
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     tls: {
//         ciphers: 'SSLv3'
//     },
//     auth: {
//         user: 'chaty.app@outlook.com',
//         pass: 'fnjqsxavoznwvgwg'
//     }
// });

// // setup e-mail data, even with unicode symbols
// var mailOptions = {
//     from: '"Our Code World " <mymail@outlook.com>', // sender address (who sends)
//     to: 'mymail@mail.com, mymail2@mail.com', // list of receivers (who receives)
//     subject: 'Hello ', // Subject line
//     text: 'Hello world ', // plaintext body
//     html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
// };

// // send mail with defined transport object
// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         return console.log(error);
//     }

//     console.log('Message sent: ' + info.response);
// });
