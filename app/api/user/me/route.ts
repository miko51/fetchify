import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    );
  }
}

