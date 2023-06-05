const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (toEmail, subject, text, html) => {

  return await transporter.sendMail({
    from: process.env.EMAIL,
    to: toEmail,
    subject: subject,
    text: text,
    html: html,
  });
};

module.exports = { sendMail };