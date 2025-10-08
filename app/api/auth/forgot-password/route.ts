import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendPasswordResetEmail, type Language } from "@/lib/email";
import { randomBytes } from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
  language: z.enum(['fr', 'en', 'es', 'it', 'de']).optional().default('fr'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, language } = forgotPasswordSchema.parse(body);

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Pour des raisons de sécurité, on retourne toujours un succès même si l'email n'existe pas
    if (!user) {
      return NextResponse.json(
        { 
          message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        },
        { status: 200 }
      );
    }

    // Générer un token sécurisé
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Sauvegarder le token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Construire le lien de réinitialisation
    const resetLink = `${process.env.NEXTAUTH_URL}/${language}/auth/reset-password?token=${token}`;

    // Envoyer l'email
    await sendPasswordResetEmail(
      user.email,
      user.name || 'there',
      resetLink,
      language as Language
    );

    return NextResponse.json(
      { 
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la demande de réinitialisation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}

