// src/EmailService.tsx
import nodemailer from 'nodemailer';
import WelcomeEmail from './WelcomeMessage';
import VerificationEmail from './VerificationEmail';
import ForgotPasswordEmail from './ForgotPasswordEmail';
import ReactDOMServer from 'react-dom/server';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_PORT === '587',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});
const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
    });

    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Function to send a Welcome email
export const sendWelcomeEmail = async (to: string, firstName: string) => {
  const subject = 'Welcome to Our Service!';
  const htmlContent = ReactDOMServer.renderToStaticMarkup(
    <WelcomeEmail firstName={firstName} />
  );
  return sendEmail(to, subject, htmlContent);
};

// Function to send a Forgot Password email
export const sendForgotPasswordEmail = async (
  to: string,
  firstName: string,
  resetToken: string
) => {
  const subject = 'Reset Your Password';
  const htmlContent = ReactDOMServer.renderToStaticMarkup(
    <ForgotPasswordEmail firstName={firstName} resetToken={resetToken} />
  );
  return sendEmail(to, subject, htmlContent);
};

// Function to send a Verification email
export const sendVerificationEmail = async (
  to: string,
  firstName: string,
  verificationToken: string
) => {
  const subject = 'Email Verification';
  const htmlContent = ReactDOMServer.renderToStaticMarkup(
    <VerificationEmail
      firstName={firstName}
      verificationToken={verificationToken}
    />
  );
  return sendEmail(to, subject, htmlContent);
};
