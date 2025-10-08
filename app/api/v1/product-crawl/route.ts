import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const API_ENDPOINT = process.env.API_ENDPOINT || "https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9";

export async function GET(req: NextRequest) {
  try {
    // Récupérer la clé API depuis l'URL (query param) OU depuis les headers
    const { searchParams } = new URL(req.url);
    const apiKey = 
      searchParams.get("apiKey") || 
      searchParams.get("apikey") ||
      req.headers.get("x-api-key") || 
      req.headers.get("authorization")?.replace("Bearer ", "");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key missing. Use '?apiKey=YOUR_KEY' in URL or 'X-API-Key' header" },
        { status: 401 }
      );
    }

    // Vérifier la clé API
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });

    if (!apiKeyRecord) {
      return NextResponse.json(
        { error: "Clé API invalide" },
        { status: 401 }
      );
    }

    if (!apiKeyRecord.isActive) {
      return NextResponse.json(
        { error: "Clé API désactivée" },
        { status: 403 }
      );
    }

    // Vérifier les crédits de l'utilisateur
    if (apiKeyRecord.user.credits < 1) {
      return NextResponse.json(
        { 
          error: "Crédits insuffisants",
          credits: apiKeyRecord.user.credits,
          message: "Veuillez acheter des crédits pour continuer à utiliser l'API"
        },
        { status: 402 }
      );
    }

    // Récupérer l'URL du produit depuis les query params
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Paramètre 'url' manquant" },
        { status: 400 }
      );
    }

    // Valider l'URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "URL invalide" },
        { status: 400 }
      );
    }

    // Faire l'appel à l'API externe
    const apiUrl = `${API_ENDPOINT}?url=${encodeURIComponent(url)}`;
    
    let apiResponse;
    let apiData;
    let success = true;
    let errorMessage = null;

    try {
      apiResponse = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!apiResponse.ok) {
        success = false;
        errorMessage = `API externe a retourné le statut ${apiResponse.status}`;
        apiData = { error: errorMessage };
      } else {
        apiData = await apiResponse.json();
      }
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : "Erreur lors de l'appel à l'API externe";
      apiData = { error: errorMessage };
    }

    // Déduire 1 crédit et enregistrer l'utilisation
    await prisma.$transaction([
      prisma.user.update({
        where: { id: apiKeyRecord.userId },
        data: { credits: { decrement: 1 } },
      }),
      prisma.apiKey.update({
        where: { id: apiKeyRecord.id },
        data: { lastUsedAt: new Date() },
      }),
      prisma.apiUsage.create({
        data: {
          userId: apiKeyRecord.userId,
          apiKeyId: apiKeyRecord.id,
          endpoint: "/api/v1/product-crawl",
          requestUrl: url,
          response: JSON.stringify(apiData),
          success,
          errorMessage,
          creditsUsed: 1,
        },
      }),
    ]);

    // Récupérer les crédits restants
    const updatedUser = await prisma.user.findUnique({
      where: { id: apiKeyRecord.userId },
      select: { credits: true },
    });

    // Retourner la réponse avec les informations sur les crédits
    return NextResponse.json(
      {
        data: apiData,
        credits: {
          remaining: updatedUser?.credits || 0,
          used: 1,
        },
      },
      { status: success ? 200 : 500 }
    );

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Récupérer la clé API depuis les headers
    const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Clé API manquante" },
        { status: 401 }
      );
    }

    // Vérifier la clé API
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true },
    });

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      return NextResponse.json(
        { error: "Clé API invalide ou désactivée" },
        { status: 401 }
      );
    }

    // Vérifier les crédits
    if (apiKeyRecord.user.credits < 1) {
      return NextResponse.json(
        { error: "Crédits insuffisants" },
        { status: 402 }
      );
    }

    // Récupérer l'URL depuis le body
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Paramètre 'url' manquant" },
        { status: 400 }
      );
    }

    // Faire l'appel à l'API externe
    const apiUrl = `${API_ENDPOINT}?url=${encodeURIComponent(url)}`;
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();

    // Déduire 1 crédit et enregistrer l'utilisation
    await prisma.$transaction([
      prisma.user.update({
        where: { id: apiKeyRecord.userId },
        data: { credits: { decrement: 1 } },
      }),
      prisma.apiKey.update({
        where: { id: apiKeyRecord.id },
        data: { lastUsedAt: new Date() },
      }),
      prisma.apiUsage.create({
        data: {
          userId: apiKeyRecord.userId,
          apiKeyId: apiKeyRecord.id,
          endpoint: "/api/v1/product-crawl",
          requestUrl: url,
          response: JSON.stringify(apiData),
          success: apiResponse.ok,
          creditsUsed: 1,
        },
      }),
    ]);

    // Récupérer les crédits restants
    const updatedUser = await prisma.user.findUnique({
      where: { id: apiKeyRecord.userId },
      select: { credits: true },
    });

    return NextResponse.json({
      data: apiData,
      credits: {
        remaining: updatedUser?.credits || 0,
        used: 1,
      },
    });

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

