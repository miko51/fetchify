import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendWelcomeEmail, type Language } from "@/lib/email";

const verifySchema = z.object({
  userId: z.string(),
  code: z.string().length(6, "Le code doit contenir 6 chiffres"),
  language: z.enum(['fr', 'en', 'es', 'it', 'de']).optional().default('fr'),
});

const WELCOME_CREDITS = 100; // Crédits offerts à l'inscription

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, code, language } = verifySchema.parse(body);

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Email déjà vérifié" },
        { status: 400 }
      );
    }

    // Vérifier le code
    const verification = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Code invalide ou expiré" },
        { status: 400 }
      );
    }

    // Activer le compte et ajouter les crédits de bienvenue
    await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        emailVerified: new Date(),
        credits: {
          increment: WELCOME_CREDITS,
        },
      },
    });

    // Supprimer les codes de vérification utilisés
    await prisma.verificationCode.deleteMany({
      where: { userId },
    });

    // Envoyer l'email de bienvenue
    await sendWelcomeEmail(
      user.email,
      user.name || 'there',
      WELCOME_CREDITS,
      language as Language
    );

    return NextResponse.json(
      {
        message: "Email vérifié avec succès",
        verified: true,
        credits: WELCOME_CREDITS,
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

    console.error("Erreur lors de la vérification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}

