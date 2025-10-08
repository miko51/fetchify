import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour créer/modifier un pack
const packageSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().default(""),
  credits: z.number().int().positive("Les crédits doivent être positifs"),
  price: z.number().int().positive("Le prix doit être positif"),
  features: z.array(z.string()).optional().default([]),
  isPopular: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

/**
 * GET /api/admin/packages
 * Liste tous les packs de crédits (admin uniquement)
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

    const packages = await prisma.creditPackage.findMany({
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

/**
 * POST /api/admin/packages
 * Créer un nouveau pack de crédits (admin uniquement)
 */
export async function POST(req: NextRequest) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        { error: "Accès refusé - droits administrateur requis" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = packageSchema.parse(body);

    const newPackage = await prisma.creditPackage.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        credits: validatedData.credits,
        price: validatedData.price,
        features: JSON.stringify(validatedData.features),
        isPopular: validatedData.isPopular,
        isActive: validatedData.isActive,
      },
    });

    return NextResponse.json({
      message: "Pack créé avec succès",
      package: {
        ...newPackage,
        features: JSON.parse(newPackage.features),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la création du pack:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

