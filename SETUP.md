# 🚀 Guide de démarrage rapide

Ce guide vous aidera à mettre en place la plateforme SaaS en quelques minutes.

## 📋 Checklist de démarrage

- [ ] Node.js 18+ installé
- [ ] PostgreSQL installé (ou compte cloud)
- [ ] Compte Stripe créé
- [ ] Variables d'environnement configurées
- [ ] Base de données initialisée
- [ ] Application lancée

## 1️⃣ Installation de PostgreSQL

### Option A : PostgreSQL local (Mac)

```bash
# Installer via Homebrew
brew install postgresql@15

# Démarrer PostgreSQL
brew services start postgresql@15

# Créer la base de données
createdb api_saas
```

### Option B : PostgreSQL Cloud (recommandé pour débuter)

**Neon (gratuit, sans carte bancaire)** : https://neon.tech
1. Créez un compte
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL` fournie

**Supabase (gratuit)** : https://supabase.com
1. Créez un compte
2. Créez un nouveau projet
3. Dans Settings > Database, copiez la `Connection string`

## 2️⃣ Configuration Stripe

### Étape 1 : Créer un compte

Allez sur https://stripe.com et créez un compte (pas besoin d'activer les paiements pour tester).

### Étape 2 : Récupérer les clés de test

1. Allez sur https://dashboard.stripe.com/test/apikeys
2. Copiez :
   - **Clé publique** (commence par `pk_test_`)
   - **Clé secrète** (commence par `sk_test_`)

### Étape 3 : Configurer les webhooks (important !)

#### En développement local :

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter à votre compte
stripe login

# Écouter les webhooks (laissez cette commande tourner)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

La commande affichera quelque chose comme :
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

Copiez ce secret dans votre `.env` comme `STRIPE_WEBHOOK_SECRET`.

#### En production :

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur "Ajouter un endpoint"
3. URL : `https://votre-domaine.com/api/stripe/webhook`
4. Sélectionnez ces événements :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copiez le secret du webhook

## 3️⃣ Configuration du projet

### Créer le fichier .env

```bash
cp .env.local.example .env
```

Éditez `.env` et remplissez toutes les valeurs :

```env
DATABASE_URL="postgresql://votre_url_postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
API_ENDPOINT="https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9"
```

## 4️⃣ Installer et lancer

```bash
# Installer les dépendances
npm install

# Initialiser la base de données
npx prisma migrate dev --name init
npx prisma generate

# Lancer l'application
npm run dev
```

## 5️⃣ Premier test

### 1. Créer un compte

1. Ouvrez http://localhost:3000
2. Cliquez sur "Inscription"
3. Créez votre compte (vous recevrez 10 crédits gratuits)

### 2. Créer une clé API

1. Allez dans le dashboard
2. Cliquez sur "Clés API"
3. Créez une nouvelle clé (ex: "Ma première clé")
4. Copiez la clé générée

### 3. Tester l'API

#### Option A : Dans le Playground

1. Allez dans "Playground"
2. Entrez une URL de produit
3. Cliquez sur "Tester l'API"

#### Option B : Avec cURL

```bash
curl -X GET "http://localhost:3000/api/v1/product-crawl?url=https://example.com/product" \
  -H "X-API-Key: sk_votre_cle_api"
```

### 4. Acheter des crédits (mode test)

1. Allez dans "Crédits"
2. Sélectionnez un pack
3. Utilisez une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres
   - Code postal : N'importe lequel

**Important** : Assurez-vous que la commande `stripe listen` est active pour que le webhook fonctionne !

## 🐛 Résolution de problèmes

### Erreur de connexion à la base de données

```
Can't reach database server at localhost:5432
```

**Solution** : Vérifiez que PostgreSQL est lancé :
```bash
brew services list
brew services start postgresql@15
```

### Erreur NextAuth "No secret"

```
[next-auth][error][NO_SECRET]
```

**Solution** : Générez un secret :
```bash
openssl rand -base64 32
```
Et ajoutez-le dans `.env` comme `NEXTAUTH_SECRET`.

### Les crédits ne sont pas ajoutés après paiement

**Solution** : Vérifiez que :
1. La commande `stripe listen` est active
2. Le `STRIPE_WEBHOOK_SECRET` est correct dans `.env`
3. Vous voyez les logs du webhook dans le terminal

### Erreur "Prisma Client not generated"

```
Cannot find module '@prisma/client'
```

**Solution** :
```bash
npx prisma generate
```

## 📚 Ressources utiles

- **Documentation Stripe** : https://stripe.com/docs
- **Cartes de test Stripe** : https://stripe.com/docs/testing
- **Documentation Prisma** : https://www.prisma.io/docs
- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation NextAuth** : https://next-auth.js.org

## ✅ Checklist de production

Avant de déployer en production :

- [ ] Utiliser les clés Stripe de production (pas `_test_`)
- [ ] Configurer un vrai webhook Stripe
- [ ] Utiliser une vraie base de données PostgreSQL
- [ ] Définir `NEXTAUTH_URL` avec votre domaine
- [ ] Activer HTTPS
- [ ] Ajouter un rate limiting
- [ ] Configurer les logs d'erreur
- [ ] Tester tous les scénarios de paiement
- [ ] Sauvegarder régulièrement la base de données

## 🎉 C'est prêt !

Vous pouvez maintenant :
- ✅ Créer des comptes utilisateurs
- ✅ Générer des clés API
- ✅ Acheter des crédits
- ✅ Utiliser l'API
- ✅ Gérer la facturation

Bon développement ! 🚀

