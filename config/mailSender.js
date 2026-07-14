const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.log("SMTP Error:", err);
  } else {
    console.log("SMTP Connected");
  }
});

const mailSender = async (to, subject, html) => {
  try {
    return await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = mailSender;
