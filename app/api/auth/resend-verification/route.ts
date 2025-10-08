import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateVerificationCode, sendVerificationEmail, type Language } from "@/lib/email";

const resendSchema = z.object({
  userId: z.string(),
  language: z.enum(['fr', 'en', 'es', 'it', 'de']).optional().default('fr'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, language } = resendSchema.parse(body);

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

    // Supprimer les anciens codes
    await prisma.verificationCode.deleteMany({
      where: { userId },
    });

    // Générer un nouveau code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Renvoyer l'email
    await sendVerificationEmail(
      user.email,
      user.name || 'there',
      code,
      language as Language
    );

    return NextResponse.json(
      { 
        message: "Code de vérification renvoyé",
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

    console.error("Erreur lors du renvoi du code:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}

