# 📄 Configuration Stripe pour Génération Automatique de Factures PDF

## 🎯 Ce que vous devez configurer sur Stripe

Stripe peut générer automatiquement des factures PDF et les envoyer par email à vos clients. Voici comment configurer cela :

---

## 1️⃣ Configuration des Emails de Reçu Automatiques (✅ Déjà configuré)

### Ce qui est déjà fait dans le code :

Dans le fichier `app/api/stripe/webhook/route.ts`, nous avons déjà configuré l'envoi automatique de reçus :

```typescript
// Mettre à jour le charge pour qu'il envoie un reçu automatiquement
await stripe.charges.update(chargeId, {
  description: `Achat de ${credits} crédits API`,
  metadata: {
    userId,
    credits: credits.toString(),
    purchase_description: `Achat de ${credits} crédits API`,
  },
  receipt_email: user.email, // ✅ Envoie automatiquement un reçu PDF
});
```

### Résultat :
- ✅ Le client reçoit automatiquement un email avec un PDF de reçu
- ✅ Le PDF contient tous les détails de la transaction
- ✅ Pas de configuration supplémentaire nécessaire

---

## 2️⃣ Configuration des Factures (Invoices) dans Stripe Dashboard

Si vous voulez des factures complètes (avec numéro de facture, TVA, etc.) au lieu de simples reçus :

### Étape 1 : Activer les factures automatiques

1. **Allez sur votre Dashboard Stripe :**
   - URL : https://dashboard.stripe.com/test/settings/billing/automatic

2. **Activez "Automatic tax calculation" (optionnel) :**
   - Si vous voulez que Stripe calcule automatiquement la TVA
   - URL : https://dashboard.stripe.com/test/settings/tax/automatic

3. **Configurez vos informations de facturation :**
   - Allez dans : **Settings** → **Business settings** → **Company details**
   - URL : https://dashboard.stripe.com/test/settings/account
   - Remplissez :
     - Nom de l'entreprise
     - Adresse complète
     - Numéro de TVA (si applicable)
     - Logo de l'entreprise

### Étape 2 : Créer un modèle de facture personnalisé

1. **Accédez aux modèles de factures :**
   - URL : https://dashboard.stripe.com/test/settings/billing/invoice

2. **Personnalisez votre modèle :**
   - Ajoutez votre logo
   - Personnalisez les couleurs
   - Ajoutez des notes ou conditions
   - Définissez la devise par défaut

### Étape 3 : Configurer l'envoi automatique

1. **Activez l'envoi automatique des factures :**
   - Allez dans **Settings** → **Billing** → **Invoices**
   - Activez "Automatically send invoices"
   - URL : https://dashboard.stripe.com/test/settings/billing/automatic

2. **Configurez les emails de factures :**
   - Personnalisez le message d'email
   - Ajoutez un CC/BCC si nécessaire
   - Définissez les conditions de paiement

---

## 3️⃣ Modification du Code pour utiliser les Invoices (Au lieu des Receipts)

Si vous préférez des factures complètes au lieu de reçus simples, modifiez le code :

### Option A : Créer des Invoices Stripe (Recommandé pour SaaS)

```typescript
// Dans app/api/stripe/webhook/route.ts

case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session;
  
  const userId = session.metadata?.userId;
  const credits = parseInt(session.metadata?.credits || "0");
  
  // Récupérer l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  // Créer une facture Stripe
  const invoice = await stripe.invoices.create({
    customer: session.customer as string, // ID du client Stripe
    auto_advance: true, // Finaliser automatiquement la facture
    collection_method: 'charge_automatically',
    description: `Achat de ${credits} crédits API - Fetchify`,
    metadata: {
      userId,
      credits: credits.toString(),
      purchase_type: 'credits',
    },
  });
  
  // Ajouter un article à la facture
  await stripe.invoiceItems.create({
    customer: session.customer as string,
    invoice: invoice.id,
    amount: session.amount_total || 0,
    currency: 'eur',
    description: `${credits} crédits API`,
  });
  
  // Finaliser et envoyer la facture
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id, {
    auto_advance: true,
  });
  
  // Envoyer la facture par email
  await stripe.invoices.sendInvoice(finalizedInvoice.id);
  
  // Enregistrer dans la base de données
  await prisma.purchase.create({
    data: {
      userId,
      stripePaymentId: session.payment_intent as string,
      stripeInvoiceId: finalizedInvoice.id,
      amount: session.amount_total || 0,
      credits,
      status: "succeeded",
    },
  });
  
  // Ajouter les crédits
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: credits } },
  });
  
  console.log(`✅ Facture ${finalizedInvoice.number} envoyée à ${user?.email}`);
  break;
}
```

---

## 4️⃣ Afficher les Factures dans l'Application

### Ajouter un lien de téléchargement de facture :

```typescript
// Dans app/[locale]/dashboard/billing/page.tsx

{purchase.stripeInvoiceId && (
  <a
    href={`https://dashboard.stripe.com/invoices/${purchase.stripeInvoiceId}`}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-colors inline-flex items-center gap-2"
  >
    <Download className="w-5 h-5 text-slate-300" />
    <span className="text-sm text-slate-300">Télécharger la facture</span>
  </a>
)}
```

### Ou créer une route API pour récupérer le PDF :

```typescript
// app/api/invoices/[invoiceId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const user = await requireAuth();
    
    // Vérifier que la facture appartient à l'utilisateur
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        stripeInvoiceId: params.invoiceId,
      },
    });
    
    if (!purchase) {
      return NextResponse.json(
        { error: "Facture non trouvée" },
        { status: 404 }
      );
    }
    
    // Récupérer la facture depuis Stripe
    const invoice = await stripe.invoices.retrieve(params.invoiceId);
    
    // Rediriger vers le PDF
    if (invoice.invoice_pdf) {
      return NextResponse.redirect(invoice.invoice_pdf);
    }
    
    return NextResponse.json(
      { error: "PDF non disponible" },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 5️⃣ Configuration de la TVA (Optionnel)

Si vous devez facturer la TVA :

### Activer Stripe Tax :

1. **Allez sur :**
   - URL : https://dashboard.stripe.com/test/settings/tax

2. **Activez Stripe Tax :**
   - Sélectionnez les pays où vous facturez la TVA
   - Stripe calculera automatiquement la TVA en fonction de l'adresse du client

3. **Modifiez la création de Checkout Session :**

```typescript
// Dans app/api/stripe/create-checkout/route.ts

const session = await stripe.checkout.sessions.create({
  // ... autres paramètres ...
  automatic_tax: {
    enabled: true, // Active le calcul automatique de la TVA
  },
  customer_update: {
    address: 'auto', // Demande l'adresse pour calculer la TVA
  },
});
```

---

## 6️⃣ Tester la Configuration

### En mode Test :

1. **Utilisez des cartes de test Stripe :**
   - `4242 4242 4242 4242` - Paiement réussi
   - Date d'expiration : n'importe quelle date future
   - CVC : n'importe quel code à 3 chiffres

2. **Vérifiez que vous recevez bien :**
   - ✅ Email de reçu automatique
   - ✅ Facture visible dans le Dashboard Stripe
   - ✅ Facture téléchargeable en PDF

3. **Vérifiez dans Stripe Dashboard :**
   - URL : https://dashboard.stripe.com/test/payments
   - Cliquez sur un paiement
   - Vérifiez que la facture est attachée

---

## 7️⃣ Passage en Production

### Avant de passer en production :

1. **Vérifiez vos informations d'entreprise :**
   - Logo haute résolution
   - Informations de contact complètes
   - Numéro de TVA valide (si applicable)

2. **Testez en mode Test d'abord :**
   - Faites plusieurs achats de test
   - Vérifiez que les emails arrivent bien
   - Vérifiez que les PDFs sont corrects

3. **Changez vos clés API :**
   - Remplacez les clés de test par les clés de production
   - URL : https://dashboard.stripe.com/apikeys

4. **Activez le webhook en production :**
   - Créez un nouveau webhook endpoint pour la production
   - Utilisez le secret de production

---

## 📋 Résumé : Ce qui est déjà configuré vs Ce qui reste à faire

### ✅ Déjà configuré dans le code :

- Envoi automatique de reçus par email via `receipt_email`
- Webhook pour traiter les paiements
- Enregistrement des achats dans la base de données
- Ajout automatique des crédits

### 🔧 À configurer sur Stripe Dashboard :

1. **Informations de l'entreprise** (obligatoire)
   - Settings → Account → Company details
   
2. **Modèle de facture personnalisé** (recommandé)
   - Settings → Billing → Invoice templates
   
3. **Configuration automatique des emails** (recommandé)
   - Settings → Billing → Automatic collection

4. **Stripe Tax** (optionnel, si TVA nécessaire)
   - Settings → Tax

---

## 🎯 Recommandation

Pour une plateforme SaaS comme Fetchify, je recommande :

1. **Court terme (actuel) :**
   - ✅ Utiliser les reçus automatiques (déjà configuré)
   - ✅ C'est suffisant pour commencer
   - ✅ Les clients reçoivent bien un PDF

2. **Moyen terme (si nécessaire) :**
   - Passer aux Invoices Stripe pour plus de professionnalisme
   - Ajouter le calcul automatique de la TVA
   - Créer une interface de téléchargement de factures dans l'app

---

## 📧 Support

Pour toute question sur la configuration Stripe :
- Documentation Stripe : https://stripe.com/docs/invoicing
- Support Stripe : https://support.stripe.com/

---

**Configuration actuelle : ✅ Les clients reçoivent déjà des reçus PDF par email !**

Si vous voulez améliorer avec des factures complètes, suivez les étapes ci-dessus.
