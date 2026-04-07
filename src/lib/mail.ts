import nodemailer from 'nodemailer';
import { SESv2Client } from '@aws-sdk/client-sesv2';

// Ensure you have configured AWS credentials in your environment variables:
// AWS_ACCESS_KEY_ID
// AWS_SECRET_ACCESS_KEY
// AWS_REGION
// EMAIL_FROM (e.g., "no-reply@yourdomain.com")

const ses = new SESv2Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const transporter = nodemailer.createTransport({
  SES: ses,
} as any);

const FROM_EMAIL = process.env.EMAIL_FROM || 'no-reply@example.com';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
