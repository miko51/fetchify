import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les paramètres de date depuis la query string
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Définir les dates par défaut (derniers 30 jours)
    const endDate = endDateParam
      ? endOfDay(parseISO(endDateParam))
      : endOfDay(new Date());
    const startDate = startDateParam
      ? startOfDay(parseISO(startDateParam))
      : startOfDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

    // Récupérer l'utilisation de l'API pour l'utilisateur dans la période
    const usage = await prisma.apiUsage.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        creditsUsed: true,
        createdAt: true,
        success: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Grouper par jour
    const dailyStats = new Map<string, { date: string; credits: number; calls: number; success: number; failed: number }>();

    usage.forEach((record) => {
      const dateKey = record.createdAt.toISOString().split("T")[0];
      
      if (!dailyStats.has(dateKey)) {
        dailyStats.set(dateKey, {
          date: dateKey,
          credits: 0,
          calls: 0,
          success: 0,
          failed: 0,
        });
      }

      const stats = dailyStats.get(dateKey)!;
      stats.credits += record.creditsUsed;
      stats.calls += 1;
      if (record.success) {
        stats.success += 1;
      } else {
        stats.failed += 1;
      }
    });

    // Convertir en tableau trié
    const data = Array.from(dailyStats.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Calculer les totaux
    const totals = {
      credits: data.reduce((sum, day) => sum + day.credits, 0),
      calls: data.reduce((sum, day) => sum + day.calls, 0),
      success: data.reduce((sum, day) => sum + day.success, 0),
      failed: data.reduce((sum, day) => sum + day.failed, 0),
    };

    return NextResponse.json({
      data,
      totals,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

