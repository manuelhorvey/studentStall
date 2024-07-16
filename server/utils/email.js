const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.PASSWORD,
  },
});

const htmlTemplatePath = path.join(__dirname, 'emailtemplate.html');
const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');

const sendVerificationEmail = async (email, link) => {
  try {
    // Replace placeholders in the HTML template with actual values
    const personalizedHtml = htmlTemplate.replace('{{verificationLink}}', link);

    let info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Account Verification Link",
      html: personalizedHtml,
    });

    console.log(
      "Message sent: %s",
      info.messageId,
      "Email sent successfully. Check your email."
    );
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { sendVerificationEmail };
