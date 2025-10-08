# 📘 Guide Complet Fetchify - Configuration & Hébergement

## ✅ Ce qui a été corrigé

### 1. **Traductions Multilingues dans le Dashboard**
✅ Le dashboard utilise maintenant `useTranslations()` pour afficher les textes dans la langue sélectionnée
✅ 5 langues complètes : 🇬🇧 EN • 🇫🇷 FR • 🇪🇸 ES • 🇮🇹 IT • 🇩🇪 DE
✅ Navigation, stats et graphiques traduits
✅ Formats de dates adaptés à chaque langue

### 2. **Rebranding en Fetchify**
✅ "Product Fetcher" remplacé par "Fetchify" partout
✅ Logo et branding mis à jour

### 3. **API Key dans l'URL** ✅ DÉJÀ IMPLÉMENTÉ
L'API supporte déjà 3 méthodes d'authentification :

```bash
# Méthode 1 : Query parameter (NOUVEAU)
GET https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL&apiKey=YOUR_API_KEY

# Méthode 2 : Query parameter alternatif
GET https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL&apikey=YOUR_API_KEY

# Méthode 3 : Header X-API-Key (classique)
GET https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL
Headers: X-API-Key: YOUR_API_KEY

# Méthode 4 : Authorization Bearer
GET https://fetchify.app/api/v1/product-crawl?url=PRODUCT_URL
Headers: Authorization: Bearer YOUR_API_KEY
```

**Code implémenté** dans `app/api/v1/product-crawl/route.ts` :
```typescript
const apiKey = 
  searchParams.get("apiKey") ||  // ?apiKey=xxx
  searchParams.get("apikey") ||  // ?apikey=xxx (alternative)
  req.headers.get("x-api-key") || 
  req.headers.get("authorization")?.replace("Bearer ", "");
```

---

## 🏗️ Hébergement - Meilleures Solutions

### Option 1️⃣ : **Vercel** (RECOMMANDÉ ⭐)

**Pourquoi Vercel ?**
- ✅ **Optimisé pour Next.js** (créé par les créateurs de Next.js)
- ✅ **Déploiement automatique** depuis GitHub/GitLab
- ✅ **Serverless Functions** pour les API routes
- ✅ **CDN global** intégré
- ✅ **SSL automatique** (HTTPS)
- ✅ **Domaine personnalisé** gratuit
- ✅ **Preview deployments** pour chaque PR
- ✅ **Free tier généreux** : 100 GB bandwidth, fonctions illimitées

**Tarifs :**
- **Hobby (Free)** : 100 GB bandwidth/mois, parfait pour commencer
- **Pro ($20/mois)** : 1 TB bandwidth, analytics avancés, support prioritaire
- **Enterprise** : Sur mesure

**Configuration :**
```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel

# 4. Production
vercel --prod
```

**Variables d'environnement à configurer sur Vercel :**
```
DATABASE_URL=file:./prisma/dev.db  # Ou PostgreSQL pour production
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=https://fetchify.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
API_ENDPOINT=https://n8n.wharfer.io/webhook/...
```

---

### Option 2️⃣ : **Railway.app**

**Pourquoi Railway ?**
- ✅ **PostgreSQL intégré** (pas besoin de service externe)
- ✅ **Déploiement depuis GitHub**
- ✅ **Prix au temps d'utilisation réel**
- ✅ **Environnements multiples** (dev, staging, prod)

**Tarifs :**
- **Developer Plan (Free)** : $5 de crédits/mois
- **Usage-based** : ~$10-30/mois selon trafic

---

### Option 3️⃣ : **Netlify**

**Pourquoi Netlify ?**
- ✅ **Simple à utiliser**
- ✅ **CDN ultra-rapide**
- ✅ **Serverless functions**
- ✅ **Forms intégrés**

**Limitations :**
- ⚠️ Moins optimisé pour Next.js que Vercel
- ⚠️ Certaines fonctionnalités Next.js peuvent ne pas fonctionner

---

### Option 4️⃣ : **DigitalOcean App Platform**

**Pourquoi DigitalOcean ?**
- ✅ **Infrastructure solide**
- ✅ **Base de données managée PostgreSQL**
- ✅ **Scaling automatique**

**Tarifs :**
- **Basic** : $5/mois pour l'app + $15/mois pour PostgreSQL = $20/mois minimum

---

## 🎯 Recommandation Finale

### Pour démarrer (MVP / Test) :
**→ Vercel Free Tier**
- Gratuit
- Facile à déployer
- Parfait pour tester le marché

### Pour la production (Trafic moyen) :
**→ Vercel Pro ($20/mois) + Supabase PostgreSQL (Free ou $25/mois)**
- Performance optimale
- Scaling automatique
- Backup automatiques

### Pour l'entreprise (Gros trafic) :
**→ Vercel Enterprise + AWS RDS PostgreSQL**
- Infrastructure robuste
- SLA garantis
- Support prioritaire

---

## 🗄️ Base de Données - Migration SQLite → PostgreSQL

**Actuellement** : SQLite (fichier local)
**Production** : PostgreSQL (recommandé)

### Migration vers PostgreSQL :

```bash
# 1. Créer une DB PostgreSQL sur Supabase/Railway/Neon
# Exemple avec Supabase (gratuit) :
# → https://supabase.com/dashboard/project/_/settings/database
# Copier la "Connection string"

# 2. Mettre à jour prisma/schema.prisma
datasource db {
  provider = "postgresql"  # Changer de "sqlite"
  url      = env("DATABASE_URL")
}

# 3. Mettre à jour .env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# 4. Migrer le schéma
npx prisma db push

# 5. (Optionnel) Migrer les données existantes
# Exporter SQLite → Importer PostgreSQL
```

**Services PostgreSQL gratuits :**
- **Supabase** : 500 MB gratuit, excellent pour démarrer
- **Neon** : 3 GB gratuit, très rapide
- **Railway** : $5 crédits/mois inclus
- **ElephantSQL** : 20 MB gratuit

---

## 📊 Système de Factures Stripe - Amélioration

### Problème actuel :
Les reçus Stripe sont envoyés automatiquement mais pas de vraies "factures" avec numéro.

### Solution recommandée :

**Option A : Factures Stripe automatiques (SIMPLE)**

Mettre à jour `app/api/stripe/webhook/route.ts` :
```typescript
// Après un paiement réussi
const invoice = await stripe.invoices.create({
  customer: session.customer as string,
  collection_method: 'charge_automatically',
  auto_advance: true,
  description: `Fetchify - ${credits} crédits API`,
  metadata: {
    userId,
    credits: credits.toString(),
  },
});

await stripe.invoiceItems.create({
  customer: session.customer as string,
  invoice: invoice.id,
  amount: session.amount_total,
  currency: 'eur',
  description: `${credits} crédits API`,
});

// Finaliser la facture
await stripe.invoices.finalizeInvoice(invoice.id);
await stripe.invoices.sendInvoice(invoice.id);
```

**Option B : Factures PDF personnalisées (AVANCÉ)**

Utiliser une bibliothèque comme `pdfkit` ou `react-pdf` pour générer des factures avec :
- Logo Fetchify
- Numérotation automatique
- Détails légaux
- QR code de paiement

---

## 🚀 Checklist de déploiement

### Avant le déploiement :
- [ ] Tester localement en mode production : `npm run build && npm start`
- [ ] Vérifier toutes les variables d'environnement
- [ ] Migrer vers PostgreSQL
- [ ] Configurer les webhooks Stripe en production
- [ ] Acheter le domaine fetchify.app
- [ ] Préparer les emails de facturation

### Après le déploiement :
- [ ] Tester le signup/login
- [ ] Tester l'achat de crédits
- [ ] Vérifier les webhooks Stripe
- [ ] Tester l'API avec les 4 méthodes d'authentification
- [ ] Configurer Google Analytics/Plausible
- [ ] Mettre en place un monitoring (Sentry, LogRocket)

---

## 🔐 Sécurité Production

```env
# .env.production
NODE_ENV=production
NEXTAUTH_SECRET=generate_strong_random_string_here
DATABASE_URL=postgresql://secure_connection
STRIPE_SECRET_KEY=sk_live_...  # NE JAMAIS utiliser sk_test_ en prod !
```

**Générer un secret sécurisé :**
```bash
openssl rand -base64 32
```

---

## 📈 Monitoring & Analytics recommandés

- **Vercel Analytics** : Inclus avec Vercel
- **Sentry** : Tracking des erreurs
- **LogRocket** : Session replay
- **Plausible** : Analytics respectueux de la vie privée
- **Uptime Robot** : Monitoring de disponibilité

---

## 💰 Estimation des coûts mensuels

### Scénario Startup (< 1000 utilisateurs) :
- Vercel Pro : $20/mois
- PostgreSQL (Supabase) : Gratuit → $25/mois
- Domaine fetchify.app : $12/an
- **Total : $20-45/mois**

### Scénario Croissance (1000-10000 utilisateurs) :
- Vercel Pro : $20/mois
- PostgreSQL (Supabase Pro) : $25/mois
- CDN/Bandwidth : $10-50/mois
- **Total : $55-95/mois**

---

## 🎉 Résumé

✅ **Traductions multilingues** : TERMINÉ
✅ **API key dans l'URL** : DÉJÀ IMPLÉMENTÉ
✅ **Rebranding Fetchify** : TERMINÉ
✅ **Guide d'hébergement** : CI-DESSUS

**Prochaines étapes suggérées :**
1. Déployer sur Vercel (15 minutes)
2. Migrer vers PostgreSQL (30 minutes)
3. Configurer Stripe webhooks en production (15 minutes)
4. Acheter le domaine et configurer DNS (1 heure)
5. Tester intensivement (2-4 heures)

🚀 **Prêt pour le lancement !**
