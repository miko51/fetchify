import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await requireAuth();

    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error("Erreur lors de la récupération des achats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des achats" },
      { status: 500 }
    );
  }
}

