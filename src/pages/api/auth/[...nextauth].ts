import NextAuth from 'next-auth';
import EmailProvider, {
  SendVerificationRequestParams,
} from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import path from 'path';
import { readFileSync } from 'fs';
import GoogleProvider from 'next-auth/providers/google';

// Email sender
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: false,
});

const emailsDir = path.resolve(process.cwd(), 'src/emails');

console.log('emailsDir', emailsDir);

const sendVerificationRequest = ({
  identifier,
  url,
}: SendVerificationRequestParams) => {
  const emailFile = readFileSync(path.join(emailsDir, 'confirm-email.html'), {
    encoding: 'utf8',
  });
  const emailTemplate = Handlebars.compile(emailFile);
  transporter.sendMail({
    from: `"✨ realVacation" ${process.env.EMAIL_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for realVacation',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier,
    }),
  });
};

const sendWelcomeEmail = async ({ user }: any) => {
  const { email } = user;

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    });
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `"✨ realVacation" ${process.env.EMAIL_FROM}`,
      to: email,
      subject: 'Welcome to realVacation! 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: 'support@themodern.dev',
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
};

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      // ? sendVerificationRequest를 사용해 아래 코드를 대체할 수 있는데 Vercel에서 안보내진다 머지
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // sendVerificationRequest,
      maxAge: 10 * 60, // Magic links are valid for 10 min only
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
    verifyRequest: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: { createUser: sendWelcomeEmail },
});
