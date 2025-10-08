# 🚀 Guide de Déploiement : Vercel + Supabase

Guide complet pour déployer **Fetchify** sur Vercel (frontend/backend) et Supabase (base de données PostgreSQL).

---

## 📋 Vue d'ensemble

- **Vercel** : Hébergement de l'application Next.js (frontend + API routes)
- **Supabase** : Base de données PostgreSQL + authentification
- **Stripe** : Paiements (déjà configuré)

---

## 🗄️ PARTIE 1 : Configuration Supabase (Base de données)

### Étape 1 : Créer un projet Supabase

1. **Allez sur** : https://supabase.com
2. **Connectez-vous** (ou créez un compte)
3. Cliquez sur **"New Project"**
4. Remplissez les informations :
   - **Name** : `fetchify` (ou le nom de votre choix)
   - **Database Password** : Générez un mot de passe sécurisé et **SAUVEGARDEZ-LE** ⚠️
   - **Region** : Choisissez la plus proche de vos utilisateurs (ex: `Europe (Paris)`)
   - **Pricing Plan** : Choisissez **Free** pour commencer
5. Cliquez sur **"Create new project"**

⏱️ **Attendez 2-3 minutes** que le projet soit créé.

### Étape 2 : Récupérer les informations de connexion

Une fois le projet créé :

1. **Allez dans** : `Settings` → `Database`
2. Scrollez jusqu'à **"Connection string"**
3. Sélectionnez l'onglet **"URI"**
4. Copiez l'**URI de connexion** qui ressemble à :

```
postgresql://postgres.[PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

⚠️ **IMPORTANT** : Remplacez `[YOUR_PASSWORD]` par le mot de passe que vous avez créé à l'étape 1.

### Étape 3 : Modifier le schéma Prisma

Votre application utilise actuellement SQLite. Il faut passer à PostgreSQL.

**1. Modifiez `prisma/schema.prisma` :**

```prisma
datasource db {
  provider = "postgresql"  // Changé de "sqlite" à "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  credits       Int       @default(0)
  isAdmin       Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  apiKeys       ApiKey[]
  apiUsage      ApiUsage[]
  purchases     Purchase[]
  
  @@map("users")
}

model ApiKey {
  id          String    @id @default(cuid())
  key         String    @unique
  name        String
  userId      String
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  lastUsedAt  DateTime?
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  apiUsage    ApiUsage[]
  
  @@map("api_keys")
}

model ApiUsage {
  id            String    @id @default(cuid())
  userId        String
  apiKeyId      String
  endpoint      String
  requestUrl    String?
  response      Json?     // PostgreSQL supporte Json
  success       Boolean
  errorMessage  String?
  creditsUsed   Int       @default(1)
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  apiKey        ApiKey    @relation(fields: [apiKeyId], references: [id], onDelete: Cascade)
  
  @@map("api_usage")
}

model Purchase {
  id                String    @id @default(cuid())
  userId            String
  stripePaymentId   String
  stripeInvoiceId   String?
  amount            Int
  credits           Int
  status            String
  createdAt         DateTime  @default(now())
  
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("purchases")
}

model CreditPackage {
  id            String    @id @default(cuid())
  name          String
  description   String    @default("")
  credits       Int
  price         Int
  stripePriceId String?   @unique
  features      String    @default("[]")
  isPopular     Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @default(now()) @updatedAt
  
  @@map("credit_packages")
}
```

**2. Créez un fichier `.env.production` :**

```bash
# Database
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[YOUR_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_URL="https://fetchify.app"
NEXTAUTH_SECRET="[GÉNÉREZ UN SECRET - voir ci-dessous]"

# Stripe (Production)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# API
API_ENDPOINT="https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9"
```

**3. Générez un secret NextAuth :**

```bash
openssl rand -base64 32
```

Copiez le résultat dans `NEXTAUTH_SECRET`.

### Étape 4 : Migrer la base de données

**1. En local, testez la connexion :**

```bash
# Créez un fichier .env.local avec votre DATABASE_URL Supabase
echo 'DATABASE_URL="postgresql://postgres...."' > .env.local

# Générez le client Prisma
npx prisma generate

# Poussez le schéma vers Supabase
npx prisma db push
```

**2. Seedez les données initiales :**

```bash
npm run db:seed
```

**3. Vérifiez dans Supabase :**

- Allez dans `Database` → `Tables`
- Vous devriez voir toutes vos tables créées : `users`, `api_keys`, `api_usage`, `purchases`, `credit_packages`

---

## ☁️ PARTIE 2 : Déploiement sur Vercel

### Étape 1 : Préparer le code

**1. Créez un dépôt Git (si pas déjà fait) :**

```bash
# Initialisez Git
git init

# Créez un .gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env*.local
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
prisma/*.db
prisma/*.db-journal
EOF

# Ajoutez tous les fichiers
git add .

# Commit
git commit -m "Initial commit - Fetchify ready for deployment"
```

**2. Poussez sur GitHub :**

```bash
# Créez un repo sur GitHub (https://github.com/new)
# Puis :

git remote add origin https://github.com/VOTRE_USERNAME/fetchify.git
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. **Allez sur** : https://vercel.com
2. **Connectez-vous** avec votre compte GitHub
3. Cliquez sur **"Add New..."** → **"Project"**
4. **Importez votre repo GitHub** `fetchify`
5. **Configurez le projet** :

#### Configuration Framework Preset :
- **Framework Preset** : Next.js (détecté automatiquement)
- **Root Directory** : `./` (racine)
- **Build Command** : `npm run build` (par défaut)
- **Output Directory** : `.next` (par défaut)

#### Variables d'environnement :

Cliquez sur **"Environment Variables"** et ajoutez :

```bash
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

NEXTAUTH_URL=https://fetchify.app
NEXTAUTH_SECRET=votre_secret_généré

STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

API_ENDPOINT=https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9
```

⚠️ **IMPORTANT** : Pour chaque variable, cochez **"Production"**, **"Preview"**, et **"Development"**.

6. Cliquez sur **"Deploy"**

⏱️ **Attendez 2-3 minutes** pour le déploiement.

### Étape 3 : Configurer le domaine personnalisé

Une fois le déploiement terminé :

1. **Allez dans** : `Settings` → `Domains`
2. **Ajoutez votre domaine** : `fetchify.app`
3. **Suivez les instructions** pour configurer les DNS :

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. **Attendez la propagation DNS** (peut prendre 1-24h)

### Étape 4 : Configuration post-déploiement

#### 1. Migrer la base de données en production

Vercel va automatiquement exécuter `prisma generate` lors du build, mais vous devez pousser le schéma manuellement :

```bash
# Avec votre DATABASE_URL de production dans .env
npx prisma db push

# Seedez les données
npm run db:seed
```

#### 2. Configurez le webhook Stripe pour la production

1. **Allez sur** : https://dashboard.stripe.com/webhooks
2. Cliquez sur **"Add endpoint"**
3. **Endpoint URL** : `https://fetchify.app/api/stripe/webhook`
4. **Events to send** : Sélectionnez :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Cliquez sur **"Add endpoint"**
6. **Copiez le Signing secret** (commence par `whsec_`)
7. **Ajoutez-le dans Vercel** :
   - Allez dans `Settings` → `Environment Variables`
   - Modifiez `STRIPE_WEBHOOK_SECRET` avec le nouveau secret
   - Cliquez sur **"Save"**
8. **Redéployez** : Settings → Deployments → ... → Redeploy

---

## ✅ PARTIE 3 : Vérification

### Checklist de vérification :

- [ ] **Supabase** :
  - [ ] Projet créé
  - [ ] Tables créées (users, api_keys, etc.)
  - [ ] Données seedées (credit_packages)

- [ ] **Vercel** :
  - [ ] Déploiement réussi
  - [ ] Toutes les variables d'environnement configurées
  - [ ] Domaine personnalisé configuré

- [ ] **Stripe** :
  - [ ] Webhook configuré pour la production
  - [ ] Clés API de production utilisées
  - [ ] Test d'achat de crédits effectué

### Tests à effectuer :

1. **Accédez à** : https://fetchify.app
2. **Créez un compte**
3. **Générez une clé API**
4. **Achetez des crédits** (testez avec une vraie carte ou carte de test Stripe)
5. **Testez l'API** avec la clé générée
6. **Vérifiez** que les crédits se déduisent

---

## 🔧 PARTIE 4 : Configuration avancée

### A. Activer Prisma Data Proxy (Optionnel mais recommandé)

Pour des connexions plus rapides à la base de données :

1. **Installez Prisma Data Platform CLI** :
```bash
npm install -g prisma
```

2. **Configurez le Data Proxy** :
```bash
npx prisma generate --data-proxy
```

3. **Remplacez DATABASE_URL** dans Vercel par l'URL du Data Proxy

### B. Monitoring et Logs

#### Vercel Analytics :
1. Allez dans **Analytics** dans votre projet Vercel
2. Activez **Web Analytics** et **Speed Insights**

#### Sentry (Monitoring d'erreurs) :
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### C. Optimisations

#### 1. Image Optimization

Vérifiez dans `next.config.js` :
```javascript
const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fetchify.app'],
  },
};

module.exports = withNextIntl(nextConfig);
```

#### 2. Caching

Configurez les headers de cache dans `next.config.js` :
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
      ],
    },
  ];
},
```

---

## 📊 PARTIE 5 : Suivi et Maintenance

### A. Logs Vercel

**Accédez aux logs** :
- Vercel Dashboard → Votre projet → Deployments → Cliquez sur un déploiement → View Function Logs

**Commandes utiles** :
```bash
# Voir les logs en temps réel
vercel logs

# Logs d'une fonction spécifique
vercel logs --follow
```

### B. Monitoring Supabase

**Accédez aux métriques** :
- Supabase Dashboard → Votre projet → Database → Monitoring

**Vérifiez** :
- Nombre de connexions actives
- Utilisation CPU/Mémoire
- Temps de réponse des requêtes

### C. Backups

**Supabase fait des backups automatiques** :
- Plan Free : Backup quotidien (7 jours de rétention)
- Plan Pro : Backups plus fréquents

**Pour faire un backup manuel** :
```bash
# Export de la base de données
pg_dump postgresql://postgres.[PROJECT_ID]:[PASSWORD]@... > backup.sql

# Restauration
psql postgresql://postgres.[PROJECT_ID]:[PASSWORD]@... < backup.sql
```

---

## 🚨 Résolution de problèmes

### Problème 1 : Build échoue sur Vercel

**Solution** :
```bash
# Vérifiez les logs de build
# Souvent causé par :
# 1. Variables d'environnement manquantes
# 2. Erreurs TypeScript

# Testez le build en local :
npm run build
```

### Problème 2 : Connexion à la base de données échoue

**Solution** :
```bash
# Vérifiez la DATABASE_URL
# Assurez-vous que :
# 1. Le mot de passe est correct
# 2. L'IP de Vercel est autorisée (par défaut, Supabase autorise toutes les IPs)
# 3. Utilisez le pooler (port 6543, pas 5432)
```

### Problème 3 : Webhook Stripe ne fonctionne pas

**Solution** :
1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
2. Testez le webhook dans Stripe Dashboard → Webhooks → Votre endpoint → Send test webhook
3. Vérifiez les logs dans Vercel

---

## 📞 Support

### Ressources :
- **Vercel Docs** : https://vercel.com/docs
- **Supabase Docs** : https://supabase.com/docs
- **Stripe Docs** : https://stripe.com/docs

### Communautés :
- **Vercel Discord** : https://vercel.com/discord
- **Supabase Discord** : https://discord.supabase.com

---

## 🎉 Résumé des URLs

| Service | URL |
|---------|-----|
| **Production** | https://fetchify.app |
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Supabase Dashboard** | https://app.supabase.com |
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **GitHub Repo** | https://github.com/VOTRE_USERNAME/fetchify |

---

**Félicitations ! Votre application Fetchify est maintenant en production ! 🚀**

---

## 📋 Checklist finale

- [ ] Supabase configuré et base de données migrée
- [ ] Code poussé sur GitHub
- [ ] Projet déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Domaine personnalisé configuré
- [ ] Webhook Stripe configuré pour la production
- [ ] Tests effectués (signup, API calls, paiements)
- [ ] Monitoring activé
- [ ] Documentation à jour

**Tout est prêt ! 🎊**
