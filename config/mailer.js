import nodemailer from "nodemailer";

const createTransporter = () => {
  const env = process.env.NODE_ENV || "development";

  if (env === "production" && process.env.MAILGUN_SMTP_HOST) {
    // Mailgun SMTP
    return nodemailer.createTransport({
      host: process.env.MAILGUN_SMTP_HOST,
      port: process.env.MAILGUN_SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.MAILGUN_SMTP_USER,
        pass: process.env.MAILGUN_SMTP_PASS,
      },
    });
  } else {
    // Mailpit for development/testing
    return nodemailer.createTransport({
      host: process.env.MAILPIT_HOST || "localhost",
      port: process.env.MAILPIT_PORT || 1025,
      secure: false,
    });
  }
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@emarket.com",
    to,
    subject,
    text,
    html,
  });
};
