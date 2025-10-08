import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Fetchify <noreply@fetchify.app>',
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

// Templates d'emails multilingues
export const emailTemplates = {
  fr: {
    verification: {
      subject: '🔐 Votre code de vérification Fetchify',
      html: (code: string, name: string) => `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">✨ Fetchify</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Bonjour ${name} ! 👋</h2>
            <p>Merci de vous être inscrit sur Fetchify. Voici votre code de vérification :</p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 48px; letter-spacing: 8px; margin: 0;">${code}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">Ce code expire dans 15 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2025 Fetchify. Tous droits réservés.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    welcome: {
      subject: (credits: number) => `🎉 Bienvenue sur Fetchify ! ${credits} crédits offerts`,
      html: (name: string, credits: number) => `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 Bienvenue sur Fetchify !</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Félicitations ${name} ! 🚀</h2>
            <p>Votre compte Fetchify est maintenant actif !</p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; border: 2px solid #667eea;">
              <h3 style="color: #667eea; margin: 0 0 10px 0;">Cadeau de bienvenue 🎁</h3>
              <p style="font-size: 32px; font-weight: bold; color: #333; margin: 0;">${credits} crédits</p>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Pour tester notre API gratuitement</p>
            </div>
            <h3 style="color: #333;">Premiers pas :</h3>
            <ul style="color: #666;">
              <li>📚 Consultez notre <a href="${process.env.NEXTAUTH_URL}/fr/docs" style="color: #667eea;">documentation</a></li>
              <li>🔑 Générez votre clé API dans votre <a href="${process.env.NEXTAUTH_URL}/fr/dashboard/keys" style="color: #667eea;">dashboard</a></li>
              <li>🎮 Testez l'API sur le <a href="${process.env.NEXTAUTH_URL}/fr/dashboard/playground" style="color: #667eea;">playground</a></li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/fr/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Accéder à mon dashboard
              </a>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2025 Fetchify. Tous droits réservés.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    passwordReset: {
      subject: '🔒 Réinitialisation de votre mot de passe',
      html: (name: string, resetLink: string) => `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔒 Fetchify</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Bonjour ${name},</h2>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">Ce lien expire dans 1 heure.</p>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Important :</strong> Ne partagez jamais ce lien avec qui que ce soit.
              </p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2025 Fetchify. Tous droits réservés.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  },
  en: {
    verification: {
      subject: '🔐 Your Fetchify verification code',
      html: (code: string, name: string) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">✨ Fetchify</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Hello ${name}! 👋</h2>
            <p>Thanks for signing up to Fetchify. Here's your verification code:</p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 48px; letter-spacing: 8px; margin: 0;">${code}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 15 minutes.</p>
            <p>If you didn't request this code, you can safely ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2025 Fetchify. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    welcome: {
      subject: (credits: number) => `🎉 Welcome to Fetchify! ${credits} free credits`,
      html: (name: string, credits: number) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 Welcome to Fetchify!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Congratulations ${name}! 🚀</h2>
            <p>Your Fetchify account is now active!</p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; border: 2px solid #667eea;">
              <h3 style="color: #667eea; margin: 0 0 10px 0;">Welcome gift 🎁</h3>
              <p style="font-size: 32px; font-weight: bold; color: #333; margin: 0;">${credits} credits</p>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">To test our API for free</p>
            </div>
            <h3 style="color: #333;">Getting started:</h3>
            <ul style="color: #666;">
              <li>📚 Check out our <a href="${process.env.NEXTAUTH_URL}/en/docs" style="color: #667eea;">documentation</a></li>
              <li>🔑 Generate your API key in your <a href="${process.env.NEXTAUTH_URL}/en/dashboard/keys" style="color: #667eea;">dashboard</a></li>
              <li>🎮 Test the API on the <a href="${process.env.NEXTAUTH_URL}/en/dashboard/playground" style="color: #667eea;">playground</a></li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/en/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Go to my dashboard
              </a>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2025 Fetchify. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    passwordReset: {
      subject: '🔒 Reset your password',
      html: (name: string, resetLink: string) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔒 Fetchify</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset my password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Important:</strong> Never share this link with anyone.
              </p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2025 Fetchify. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  },
  // Ajouter es, it, de avec les mêmes templates traduits...
} as const;

export type Language = keyof typeof emailTemplates;

// Fonction pour générer un code de vérification à 6 chiffres
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Fonction pour envoyer un email de vérification
export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string,
  language: Language = 'fr'
) {
  const template = emailTemplates[language].verification;
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html(code, name),
  });
}

// Fonction pour envoyer un email de bienvenue
export async function sendWelcomeEmail(
  email: string,
  name: string,
  credits: number,
  language: Language = 'fr'
) {
  const template = emailTemplates[language].welcome;
  return sendEmail({
    to: email,
    subject: template.subject(credits),
    html: template.html(name, credits),
  });
}

// Fonction pour envoyer un email de réinitialisation de mot de passe
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string,
  language: Language = 'fr'
) {
  const template = emailTemplates[language].passwordReset;
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html(name, resetLink),
  });
}

