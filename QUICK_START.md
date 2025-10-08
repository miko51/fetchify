# ⚡ Démarrage ultra-rapide (5 minutes)

Ce guide vous permet de lancer l'application en 5 minutes chrono !

## 🚀 Installation express

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env

# 3. Éditer le .env avec vos valeurs (voir ci-dessous)
nano .env

# 4. Initialiser la base de données
npx prisma migrate dev --name init
npx prisma generate

# 5. Lancer l'application
npm run dev
```

## 🔑 Configuration minimale du .env

Pour démarrer rapidement, voici les valeurs minimales :

```env
# Base de données (choisissez une option)
# Option A - PostgreSQL local :
DATABASE_URL="postgresql://postgres:password@localhost:5432/api_saas?schema=public"

# Option B - Neon (gratuit, cloud) : https://neon.tech
# DATABASE_URL="postgresql://user:pass@ep-xxx.region.neon.tech/neondb"

# NextAuth (générez avec : openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="collez-le-secret-généré-ici"

# Stripe (récupérez sur : https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# API externe (déjà configurée)
API_ENDPOINT="https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9"
```

## 🎯 Tester rapidement

### 1. Dans un premier terminal - Lancer l'app

```bash
npm run dev
```

### 2. Dans un second terminal - Webhooks Stripe

```bash
# Installer Stripe CLI (une seule fois)
brew install stripe/stripe-cli/stripe

# Se connecter (une seule fois)
stripe login

# Écouter les webhooks (à chaque session)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Important** : Copiez le `whsec_...` affiché et mettez-le dans votre `.env` comme `STRIPE_WEBHOOK_SECRET`

### 3. Créer un compte

1. Allez sur http://localhost:3000
2. Cliquez sur "Inscription"
3. Créez votre compte (10 crédits gratuits !)

### 4. Tester l'API

1. Allez dans "Clés API"
2. Créez une clé
3. Allez dans "Playground"
4. Entrez une URL : `https://www.amazon.fr/dp/B0B1VQ1ZQY`
5. Cliquez sur "Tester l'API"

## 🎫 Tester un achat (mode test Stripe)

1. Allez dans "Crédits"
2. Sélectionnez un pack
3. Utilisez cette carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34` (n'importe quelle date future)
   - CVC : `123` (n'importe quel 3 chiffres)

## 🐛 Problème ?

### "Can't reach database server"

PostgreSQL n'est pas lancé :
```bash
brew services start postgresql@15
```

### "No secret for NextAuth"

Générez-en un :
```bash
openssl rand -base64 32
```

### "Stripe webhook error"

Vérifiez que `stripe listen` est actif dans un terminal.

## ✅ Tout fonctionne ?

Vous êtes prêt à :
- ✨ Personnaliser l'interface
- 🎨 Adapter les prix des packs
- 🚀 Déployer en production

Pour aller plus loin, consultez :
- `README.md` - Documentation complète
- `SETUP.md` - Guide détaillé
- `DEPLOIEMENT.md` - Déployer en production

Bon dev ! 🎉

