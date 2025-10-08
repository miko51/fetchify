import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour modifier un pack
const packageUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  credits: z.number().int().positive().optional(),
  price: z.number().int().positive().optional(),
  features: z.array(z.string()).optional(),
  isPopular: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/admin/packages/[id]
 * Récupérer un pack spécifique (admin uniquement)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        { error: "Accès refusé - droits administrateur requis" },
        { status: 403 }
      );
    }

    const pkg = await prisma.creditPackage.findUnique({
      where: { id: params.id },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "Pack introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      package: {
        ...pkg,
        features: pkg.features ? JSON.parse(pkg.features) : [],
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du pack:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/packages/[id]
 * Modifier un pack existant (admin uniquement)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        { error: "Accès refusé - droits administrateur requis" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = packageUpdateSchema.parse(body);

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description;
    if (validatedData.credits !== undefined)
      updateData.credits = validatedData.credits;
    if (validatedData.price !== undefined) updateData.price = validatedData.price;
    if (validatedData.features !== undefined)
      updateData.features = JSON.stringify(validatedData.features);
    if (validatedData.isPopular !== undefined)
      updateData.isPopular = validatedData.isPopular;
    if (validatedData.isActive !== undefined)
      updateData.isActive = validatedData.isActive;

    const updatedPackage = await prisma.creditPackage.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Pack mis à jour avec succès",
      package: {
        ...updatedPackage,
        features: JSON.parse(updatedPackage.features),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de la mise à jour du pack:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/packages/[id]
 * Supprimer un pack (admin uniquement)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        { error: "Accès refusé - droits administrateur requis" },
        { status: 403 }
      );
    }

    await prisma.creditPackage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Pack supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du pack:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

