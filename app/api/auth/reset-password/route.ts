import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword } = resetPasswordSchema.parse(body);

    // Vérifier le token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        password: hashedPassword,
      },
    });

    // Marquer le token comme utilisé
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    // Supprimer tous les autres tokens de cet utilisateur
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: resetToken.userId,
        id: {
          not: resetToken.id,
        },
      },
    });

    return NextResponse.json(
      { 
        message: "Mot de passe réinitialisé avec succès",
        success: true,
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

    console.error("Erreur lors de la réinitialisation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe" },
      { status: 500 }
    );
  }
}

