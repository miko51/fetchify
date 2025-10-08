import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Désactiver le cache pour cette route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Ajouter des headers pour désactiver le cache
    const response = NextResponse.json({ packages: packagesWithParsedFeatures });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des packs:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

