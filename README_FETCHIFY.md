# 🚀 Fetchify - API SaaS Platform

**Fetchify** est une plateforme SaaS permettant d'extraire des données produits de n'importe quelle boutique e-commerce via une API simple et puissante.

---

## ✨ Fonctionnalités

### 🌍 Multilingue (5 langues)
- 🇬🇧 Anglais
- 🇫🇷 Français
- 🇪🇸 Espagnol
- 🇮🇹 Italien
- 🇩🇪 Allemand

### 🔑 Authentification API Flexible
4 méthodes d'authentification supportées :
```bash
# 1. Query parameter
?apiKey=YOUR_KEY

# 2. Query parameter (lowercase)
?apikey=YOUR_KEY

# 3. Header X-API-Key
X-API-Key: YOUR_KEY

# 4. Authorization Bearer
Authorization: Bearer YOUR_KEY
```

### 💳 Système de Crédits
- Achat de crédits via Stripe
- Packages flexibles
- Facturation automatique
- Gestion des abonnements

### 📊 Dashboard Complet
- Statistiques d'utilisation
- Graphiques de consommation
- Gestion des clés API
- Historique des achats

### 👨‍💼 Panel Administrateur
- Gestion des utilisateurs
- Gestion des packages de crédits
- Statistiques globales
- Configuration Stripe

---

## 🛠️ Technologies

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Base de données** : SQLite (dev) / PostgreSQL (prod)
- **ORM** : Prisma
- **Authentification** : NextAuth.js
- **Paiements** : Stripe
- **UI** : Tailwind CSS + shadcn/ui
- **Graphiques** : Recharts
- **i18n** : next-intl

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# 1. Cloner le projet
git clone [url]
cd fetchify

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés

# 4. Initialiser la base de données
npm run db:push
npm run db:seed

# 5. Lancer en développement
npm run dev
```

L'application est disponible sur `http://localhost:3005`

---

## 📁 Structure du Projet

```
fetchify/
├── app/
│   ├── [locale]/              # Routes multilingues
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Authentification
│   │   ├── dashboard/         # Dashboard utilisateur
│   │   └── admin/             # Panel admin
│   └── api/                   # API routes
│       ├── v1/                # API publique
│       ├── auth/              # NextAuth
│       ├── stripe/            # Webhooks Stripe
│       └── ...
├── components/                # Composants React
├── lib/                       # Utilitaires
├── messages/                  # Traductions i18n
│   ├── en.json
│   ├── fr.json
│   ├── es.json
│   ├── it.json
│   └── de.json
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   └── seed.ts                # Données initiales
└── public/                    # Assets statiques
```

---

## 🔧 Configuration

### Variables d'Environnement

```env
# Base de données
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3005"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# API externe
API_ENDPOINT="https://your-api-endpoint.com"
```

### Configuration Stripe

1. **Mode Test** :
   - Créer un compte sur stripe.com
   - Récupérer les clés de test
   - Configurer le webhook local :
   ```bash
   stripe listen --forward-to localhost:3005/api/stripe/webhook
   ```

2. **Mode Production** :
   - Activer le compte Stripe
   - Utiliser les clés live
   - Configurer le webhook sur le domaine de production

---

## 📊 API Reference

### Endpoint Principal
```
GET /api/v1/product-crawl
```

**Paramètres** :
- `url` (required) : URL du produit à scraper
- `apiKey` (required) : Votre clé API

**Exemple** :
```bash
curl "http://localhost:3005/api/v1/product-crawl?url=https://example.com/product&apiKey=YOUR_KEY"
```

**Réponse** :
```json
{
  "data": {
    "title": "Product Title",
    "price": 99.99,
    "description": "...",
    "images": [...],
    "stock": "in_stock"
  },
  "credits": {
    "remaining": 499,
    "used": 1
  }
}
```

---

## 🗄️ Base de Données

### Modèles Prisma

- **User** : Utilisateurs et crédits
- **ApiKey** : Clés API générées
- **ApiUsage** : Historique des appels
- **Purchase** : Historique des achats
- **CreditPackage** : Packages de crédits disponibles

### Commandes Utiles

```bash
# Créer/mettre à jour le schéma
npm run db:push

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (GUI)
npm run db:studio

# Seeder la base
npm run db:seed

# Créer un admin
ts-node scripts/make-admin.ts
```

---

## 🌐 Internationalisation

### Ajouter une Nouvelle Langue

1. Créer `messages/xx.json` (xx = code langue)
2. Copier la structure de `messages/en.json`
3. Traduire toutes les clés
4. Ajouter la langue dans :
   - `middleware.ts` : `locales: ['en', 'fr', ..., 'xx']`
   - `i18n.ts` : Ajouter l'import de locale date-fns si nécessaire
   - `components/LanguageSwitcher.tsx` : Ajouter dans le tableau `languages`

### Utiliser les Traductions

```typescript
// Dans un composant client
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  
  return <h1>{t('dashboard.title')}</h1>;
}
```

---

## 🚀 Déploiement

### Option Recommandée : Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Configurer les variables d'environnement sur dashboard.vercel.com

# 4. Déployer en production
vercel --prod
```

### Migration vers PostgreSQL

```bash
# 1. Créer une base PostgreSQL (Supabase, Railway, Neon...)

# 2. Mettre à jour prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 3. Mettre à jour DATABASE_URL dans .env

# 4. Migrer
npx prisma db push
```

**Voir le guide complet** : `GUIDE_COMPLET.md`

---

## 🔐 Sécurité

### Production Checklist
- [ ] Utiliser HTTPS (SSL)
- [ ] Changer `NEXTAUTH_SECRET`
- [ ] Utiliser les clés Stripe live
- [ ] Configurer les CORS
- [ ] Activer le rate limiting
- [ ] Monitorer avec Sentry
- [ ] Sauvegardes automatiques de la DB

### Génération de Secret Sécurisé
```bash
openssl rand -base64 32
```

---

## 📈 Monitoring

### Outils Recommandés
- **Vercel Analytics** : Performance & Core Web Vitals
- **Sentry** : Tracking des erreurs
- **LogRocket** : Session replay
- **Plausible** : Analytics respectueux de la vie privée
- **Uptime Robot** : Monitoring de disponibilité

---

## 🐛 Dépannage

### Erreur "API key invalid"
- Vérifier que la clé API existe dans la base
- Vérifier que `isActive = true`

### Erreur "Insufficient credits"
- Acheter des crédits via le dashboard
- Vérifier le compte Stripe

### Erreur d'hydratation React
- Vérifier les formatages de nombres/dates
- Utiliser `suppressHydrationWarning` si nécessaire

### Webhooks Stripe ne fonctionnent pas
- En local : utiliser `stripe listen`
- En prod : vérifier l'URL du webhook dans Stripe Dashboard

---

## 📚 Documentation

- **Guide complet** : `GUIDE_COMPLET.md`
- **Changements récents** : `CHANGES_SUMMARY.md`
- **Design** : `NOUVEAU_DESIGN_PRODUCT_FETCHER.md`
- **Erreurs résolues** : `ERREUR_HYDRATION_FIXEE.md`

---

## 🤝 Support

Pour toute question :
1. Consulter la documentation dans `/docs`
2. Vérifier les issues GitHub
3. Contacter le support technique

---

## 📝 Licence

© 2025 Fetchify. Tous droits réservés.

---

## 🎉 Statut du Projet

✅ **Production Ready**
- Multilingue complet (5 langues)
- Dashboard fonctionnel
- Paiements Stripe intégrés
- API sécurisée
- Documentation complète

**Version** : 2.0.0
**Dernière mise à jour** : 8 octobre 2025
