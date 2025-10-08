import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAuth();

    // Récupérer les 100 dernières utilisations
    const usage = await prisma.apiUsage.findMany({
      where: { userId: user.id },
      include: {
        apiKey: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Statistiques
    const stats = await prisma.apiUsage.aggregate({
      where: { userId: user.id },
      _sum: {
        creditsUsed: true,
      },
      _count: true,
    });

    return NextResponse.json({
      usage,
      stats: {
        totalCalls: stats._count,
        totalCreditsUsed: stats._sum.creditsUsed || 0,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données d'utilisation" },
      { status: 500 }
    );
  }
}

