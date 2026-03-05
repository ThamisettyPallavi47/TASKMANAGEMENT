// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USERNAME, // We will need these in .env
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL_FROM || "noreply@studiin.com",
//         to: options.email,
//         subject: options.subject,
//         html: options.message,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully to:", options.email);
//     } catch (error) {
//         console.log("------------------------------------------");
//         console.log("⚠️ EMAIL SENDING FAILED (Likely missing credentials in .env)");
//         console.log("⚠️ DEV MODE: Printing Email Content Below:");
//         console.log(`To: ${options.email}`);
//         console.log(`Subject: ${options.subject}`);
//         console.log(`Message: ${options.message}`);
//         console.log("------------------------------------------");
//         // Don't throw error in dev mode so flow continues
//     }
// };

// module.exports = sendEmail;


const nodemailer = require("nodemailer");

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully to:", options.email);
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw error; // important so backend shows error
    }
};

module.exports = sendEmail;