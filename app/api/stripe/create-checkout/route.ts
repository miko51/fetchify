import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { stripe, CREDIT_PACKAGES } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { packageId } = body;

    // Trouver le package de crédits
    const creditPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);

    if (!creditPackage) {
      return NextResponse.json(
        { error: "Package de crédits invalide" },
        { status: 400 }
      );
    }

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${creditPackage.name} - ${creditPackage.credits} crédits`,
              description: `Pack de ${creditPackage.credits} crédits API`,
            },
            unit_amount: creditPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/dashboard?payment=success`,
      cancel_url: `${req.nextUrl.origin}/dashboard/credits?payment=cancelled`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        packageId: creditPackage.id,
        credits: creditPackage.credits.toString(),
      },
      customer_email: user.email,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}

