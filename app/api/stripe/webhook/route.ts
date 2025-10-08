import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Erreur de vérification du webhook:", err);
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const credits = parseInt(session.metadata?.credits || "0");
        const packageId = session.metadata?.packageId;

        if (!userId || !credits) {
          console.error("Métadonnées manquantes dans la session:", session.id);
          break;
        }

        // Récupérer l'utilisateur
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          console.error("Utilisateur introuvable:", userId);
          break;
        }

        // Envoyer un reçu par email automatiquement
        let invoiceId: string | null = session.invoice as string | null;
        
        try {
          const paymentIntentId = session.payment_intent as string;

          if (paymentIntentId) {
            // Récupérer le PaymentIntent
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            const chargeId = paymentIntent.latest_charge as string;

            if (chargeId) {
              // Mettre à jour le charge pour qu'il envoie un reçu automatiquement
              await stripe.charges.update(chargeId, {
                description: `Achat de ${credits} crédits API`,
                metadata: {
                  userId,
                  credits: credits.toString(),
                  purchase_description: `Achat de ${credits} crédits API`,
                },
                receipt_email: user.email, // Envoie automatiquement un reçu PDF
              });

              console.log(`📧 Reçu automatique envoyé à ${user.email} pour ${credits} crédits`);
            }
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi du reçu:", error);
          // On continue même si ça échoue
        }

        // Ajouter les crédits à l'utilisateur
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: {
              increment: credits,
            },
          },
        });

        // Enregistrer l'achat avec l'ID de la facture
        await prisma.purchase.create({
          data: {
            userId,
            stripePaymentId: session.payment_intent as string,
            stripeInvoiceId: invoiceId,
            amount: session.amount_total || 0,
            credits,
            status: "succeeded",
          },
        });

        console.log(`✅ ${credits} crédits ajoutés pour l'utilisateur ${userId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("❌ Paiement échoué:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Type d'événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du webhook" },
      { status: 500 }
    );
  }
}

