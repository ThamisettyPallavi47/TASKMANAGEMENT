

// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Verify connection when server starts
// transporter.verify((error) => {
//   if (error) {
//     console.log("❌ SMTP CONNECTION ERROR:", error);
//   } else {
//     console.log("✅ SMTP SERVER READY");
//   }
// });

// const sendEmail = async (options) => {
//   try {
//     const mailOptions = {
//       from: `"StudiIn" <${process.env.EMAIL_USERNAME}>`,
//       to: options.email,
//       subject: options.subject,
//       html: options.message,
//     };

//     console.log("📧 Sending email to:", options.email);

//     await transporter.sendMail(mailOptions);

//     console.log("✅ Email sent successfully to:", options.email);
//   } catch (error) {
//     console.error("❌ Email sending failed:", error);
//     throw error;
//   }
// };

// module.exports = sendEmail;

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {

    console.log("📧 Sending email to:", options.email);

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "StudiIn <onboarding@resend.dev>",
      to: options.email,
      subject: options.subject,
      html: options.message,
    });

    console.log("✅ Email sent successfully:", response);

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;