import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/utils";

// GET - Récupérer toutes les clés API de l'utilisateur
export async function GET() {
  try {
    const user = await requireAuth();

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        key: true,
        name: true,
        isActive: true,
        createdAt: true,
        lastUsedAt: true,
        _count: {
          select: { apiUsage: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("Erreur lors de la récupération des clés:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des clés API" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle clé API
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom de la clé est requis" },
        { status: 400 }
      );
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        key: generateApiKey(),
        name: name.trim(),
        userId: user.id,
      },
    });

    return NextResponse.json(
      { 
        message: "Clé API créée avec succès",
        apiKey: {
          id: apiKey.id,
          key: apiKey.key,
          name: apiKey.name,
          isActive: apiKey.isActive,
          createdAt: apiKey.createdAt,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création de la clé:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la clé API" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une clé API
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json(
        { error: "ID de la clé manquant" },
        { status: 400 }
      );
    }

    // Vérifier que la clé appartient à l'utilisateur
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: user.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API non trouvée" },
        { status: 404 }
      );
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    });

    return NextResponse.json({ message: "Clé API supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la clé:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la clé API" },
      { status: 500 }
    );
  }
}

// PATCH - Activer/Désactiver une clé API
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    // Vérifier que la clé appartient à l'utilisateur
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API non trouvée" },
        { status: 404 }
      );
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      message: "Clé API mise à jour avec succès",
      apiKey: updatedKey,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la clé:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la clé API" },
      { status: 500 }
    );
  }
}

