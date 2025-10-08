# 🚀 Plateforme SaaS - API de Crawl de Produits

Une plateforme SaaS complète permettant aux utilisateurs d'utiliser une API de crawl de produits avec un système de crédits et de paiement via Stripe.

## ✨ Fonctionnalités

- 🔐 **Authentification** : Inscription et connexion sécurisées
- 🔑 **Gestion des clés API** : Créer, activer/désactiver et supprimer des clés API
- 💳 **Système de crédits** : Achat de packs de crédits via Stripe
- 🎮 **Playground** : Tester l'API directement depuis le navigateur
- 📊 **Dashboard** : Vue d'ensemble de l'utilisation et des statistiques
- 🧾 **Facturation** : Accès aux factures et portail client Stripe
- 🔒 **Sécurisé** : Protection des routes API avec clés et gestion des crédits

## 🛠️ Technologies utilisées

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : NextAuth.js
- **Paiements** : Stripe
- **UI** : Tailwind CSS + Radix UI
- **Validation** : Zod

## 📋 Prérequis

- Node.js 18+
- PostgreSQL
- Compte Stripe

## 🚀 Installation

### 1. Cloner le projet

```bash
cd "Api products crawl"
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/api_saas?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-aleatoire-tres-long"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Configuration de l'API
API_ENDPOINT="https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9"
```

### 4. Générer le secret NextAuth

```bash
openssl rand -base64 32
```

Copiez le résultat dans `NEXTAUTH_SECRET`.

### 5. Initialiser la base de données

```bash
# Créer les migrations
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

### 6. (Optionnel) Remplir la base avec des données de test

```bash
npx prisma studio
```

### 7. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## ⚙️ Configuration Stripe

### 1. Créer un compte Stripe

Créez un compte sur [stripe.com](https://stripe.com) si ce n'est pas déjà fait.

### 2. Récupérer les clés API

- Allez dans **Développeurs** > **Clés API**
- Copiez la clé publique et la clé secrète de test
- Ajoutez-les dans votre fichier `.env`

### 3. Configurer les webhooks

Pour recevoir les notifications de paiement :

1. Allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL : `https://votre-domaine.com/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copiez le secret du webhook dans `STRIPE_WEBHOOK_SECRET`

### En développement local

Utilisez Stripe CLI pour tester les webhooks localement :

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Se connecter
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 📖 Utilisation de l'API

### Endpoint

```
GET /api/v1/product-crawl?url=URL_DU_PRODUIT
```

### Headers requis

```
X-API-Key: votre_clé_api
```

### Exemple avec cURL

```bash
curl -X GET "http://localhost:3000/api/v1/product-crawl?url=https://example.com/product/123" \
  -H "X-API-Key: sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Exemple avec JavaScript

```javascript
const response = await fetch(
  'http://localhost:3000/api/v1/product-crawl?url=https://example.com/product/123',
  {
    headers: {
      'X-API-Key': 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  }
);

const data = await response.json();
console.log(data);
```

### Réponse

```json
{
  "data": {
    // Informations du produit
  },
  "credits": {
    "remaining": 99,
    "used": 1
  }
}
```

## 🎯 Structure du projet

```
.
├── app/
│   ├── api/                    # Routes API
│   │   ├── auth/              # Authentification
│   │   ├── keys/              # Gestion des clés API
│   │   ├── stripe/            # Intégration Stripe
│   │   ├── usage/             # Statistiques d'utilisation
│   │   ├── user/              # Informations utilisateur
│   │   └── v1/                # API publique
│   │       └── product-crawl/ # Endpoint principal
│   ├── auth/                  # Pages d'authentification
│   ├── dashboard/             # Interface utilisateur
│   │   ├── billing/          # Facturation
│   │   ├── credits/          # Achat de crédits
│   │   ├── keys/             # Gestion des clés
│   │   └── playground/       # Test de l'API
│   └── page.tsx              # Page d'accueil
├── components/
│   └── ui/                   # Composants UI réutilisables
├── lib/
│   ├── prisma.ts            # Client Prisma
│   ├── stripe.ts            # Configuration Stripe
│   ├── auth.ts              # Utilitaires d'authentification
│   └── utils.ts             # Fonctions utilitaires
├── prisma/
│   └── schema.prisma        # Schéma de base de données
└── package.json
```

## 🗄️ Schéma de base de données

### User
- Informations utilisateur
- Crédits disponibles
- Relations : ApiKey, ApiUsage, Purchase

### ApiKey
- Clés API générées
- Statut actif/inactif
- Date de dernière utilisation

### ApiUsage
- Historique des appels API
- Crédits consommés
- Réponses stockées

### Purchase
- Historique des achats
- Intégration Stripe
- Montants et crédits achetés

## 🔐 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ Sessions JWT avec NextAuth
- ✅ Validation des entrées avec Zod
- ✅ Protection CSRF
- ✅ Rate limiting recommandé pour la production
- ✅ Clés API sécurisées (sk_xxxx format)

## 🚀 Déploiement

### Vercel (recommandé)

1. Poussez votre code sur GitHub
2. Importez le projet sur [Vercel](https://vercel.com)
3. Ajoutez les variables d'environnement
4. Déployez !

### Variables d'environnement en production

N'oubliez pas de :
- Utiliser les clés Stripe de production
- Changer `NEXTAUTH_URL` vers votre domaine
- Configurer un vrai PostgreSQL (pas SQLite)
- Mettre à jour l'URL du webhook Stripe

## 📝 Commandes utiles

```bash
# Lancer en développement
npm run dev

# Build pour la production
npm run build

# Lancer en production
npm start

# Prisma Studio (interface visuelle pour la DB)
npx prisma studio

# Créer une migration
npx prisma migrate dev --name nom_migration

# Reset la base de données
npx prisma migrate reset
```

## 🎨 Personnalisation

### Modifier les packs de crédits

Éditez le fichier `lib/stripe.ts` :

```typescript
export const CREDIT_PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 999, // en centimes (9.99€)
  },
  // Ajoutez vos packs...
];
```

### Modifier le coût par appel

Dans `app/api/v1/product-crawl/route.ts`, changez la valeur de `creditsUsed` :

```typescript
creditsUsed: 1, // Nombre de crédits par appel
```

## 🤝 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Contactez support@example.com

## 📄 Licence

MIT

---

Développé avec ❤️ pour simplifier l'utilisation des APIs de crawl

