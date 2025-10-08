import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateVerificationCode, sendVerificationEmail, type Language } from "@/lib/email";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
  language: z.enum(['fr', 'en', 'es', 'it', 'de']).optional().default('fr'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, language } = registerSchema.parse(body);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur (non vérifié)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        credits: 0, // Les crédits seront ajoutés après vérification
        isVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
      },
    });

    // Générer et sauvegarder le code de vérification
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Envoyer l'email de vérification
    await sendVerificationEmail(
      email,
      name || 'there',
      code,
      language as Language
    );

    return NextResponse.json(
      { 
        message: "Utilisateur créé avec succès. Vérifiez votre email.",
        userId: user.id,
        requiresVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}

