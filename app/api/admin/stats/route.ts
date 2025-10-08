import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/stats
 * Statistiques globales (admin uniquement)
 */
export async function GET(req: NextRequest) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        { error: "Accès refusé - droits administrateur requis" },
        { status: 403 }
      );
    }

    // Récupérer les statistiques
    const [
      totalUsers,
      totalApiKeys,
      totalPurchases,
      totalRevenue,
      totalApiCalls,
      recentUsers,
      recentPurchases,
    ] = await Promise.all([
      // Nombre total d'utilisateurs
      prisma.user.count(),

      // Nombre total de clés API
      prisma.apiKey.count(),

      // Nombre total d'achats
      prisma.purchase.count(),

      // Revenu total (somme des montants)
      prisma.purchase.aggregate({
        _sum: { amount: true },
        where: { status: "succeeded" },
      }),

      // Nombre total d'appels API
      prisma.apiUsage.count(),

      // 5 derniers utilisateurs inscrits
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          credits: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // 5 derniers achats
      prisma.purchase.findMany({
        select: {
          id: true,
          amount: true,
          credits: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalApiKeys,
        totalPurchases,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalApiCalls,
      },
      recentUsers,
      recentPurchases,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

