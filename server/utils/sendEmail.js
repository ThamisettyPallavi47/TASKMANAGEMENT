

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection when server starts
transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP CONNECTION ERROR:", error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"StudiIn" <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    console.log("📧 Sending email to:", options.email);

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully to:", options.email);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;

