import nodemailer from 'nodemailer';
import envConfig from '../config/envConfig';

const transporter = nodemailer.createTransport({
  host: envConfig.mail.host, // Or Gmail
  port: envConfig.mail.port,
  auth: {
    user: envConfig.mail.auth.user,
    pass: envConfig.mail.auth.pass
  }
});

// Inside your worker...

export const sendMail = async (userEmail: string, eventTitle: string) => {
    await transporter.sendMail({
        from: envConfig.mail.auth.user,
        to: userEmail,
        subject: "Booking Confirmation",
        text: `Your booking for ${eventTitle} is confirmed!`,
    });
}