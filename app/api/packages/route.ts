import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/packages
 * Liste tous les packs de crédits actifs (public)
 */
export async function GET(req: NextRequest) {
  try {
    const packages = await prisma.creditPackage.findMany({
      where: { isActive: true },
      orderBy: { credits: "asc" },
    });

    // Parser les features JSON
    const packagesWithParsedFeatures = packages.map((pkg) => ({
      ...pkg,
      features: pkg.features ? JSON.parse(pkg.features) : [],
    }));

    return NextResponse.json({ packages: packagesWithParsedFeatures });
  } catch (error) {
    console.error("Erreur lors de la récupération des packs:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

