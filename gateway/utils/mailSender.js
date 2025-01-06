const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: 'phaitoun003@gmail.com',
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log("error while send mail 🤔",error.message);
  }
};
module.exports ={
  mailSender
};