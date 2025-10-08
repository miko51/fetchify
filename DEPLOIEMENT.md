# 🚀 Guide de déploiement

Ce guide vous accompagne dans le déploiement de votre plateforme SaaS en production.

## 📋 Checklist pré-déploiement

Avant de déployer, assurez-vous d'avoir :

- [ ] Un compte sur une plateforme de déploiement (Vercel, Railway, etc.)
- [ ] Une base de données PostgreSQL en production
- [ ] Un compte Stripe avec les clés de production
- [ ] Un nom de domaine (optionnel mais recommandé)

## 🌐 Déploiement sur Vercel (Recommandé)

Vercel est la plateforme la plus simple pour déployer une application Next.js.

### 1. Préparer le projet

```bash
# S'assurer que tout fonctionne localement
npm run build
```

### 2. Connecter à GitHub

1. Créez un repository GitHub
2. Poussez votre code :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/votre-repo.git
git push -u origin main
```

### 3. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Import Project"
3. Sélectionnez votre repository GitHub
4. Configurez les variables d'environnement (voir ci-dessous)
5. Cliquez sur "Deploy"

### 4. Variables d'environnement sur Vercel

Dans les settings du projet Vercel, ajoutez :

```env
DATABASE_URL=postgresql://votre_url_postgres_production
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre_secret_production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
API_ENDPOINT=https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9
```

## 🗄️ Base de données PostgreSQL en production

### Option 1 : Neon (Gratuit pour commencer)

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez la `DATABASE_URL`
4. Ajoutez-la dans Vercel

### Option 2 : Supabase (Gratuit pour commencer)

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans Settings > Database, copiez la "Connection string"
4. Ajoutez-la dans Vercel

### Option 3 : Railway

1. Allez sur [railway.app](https://railway.app)
2. Créez un nouveau projet PostgreSQL
3. Copiez la `DATABASE_URL`
4. Ajoutez-la dans Vercel

### Initialiser la base de données

Après avoir configuré la base de données :

```bash
# En local, avec la DATABASE_URL de production dans .env
npx prisma migrate deploy

# Ou via la console Vercel
# Dans Settings > Functions, activez le cron job pour la migration
```

## 💳 Stripe en production

### 1. Activer le compte Stripe

1. Allez sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Complétez les informations de votre entreprise
3. Activez votre compte

### 2. Récupérer les clés de production

1. Désactivez le "Mode Test" dans le dashboard
2. Allez dans Développeurs > Clés API
3. Copiez les clés de production (commence par `sk_live_` et `pk_live_`)

### 3. Configurer le webhook en production

1. Allez dans Développeurs > Webhooks
2. Cliquez sur "Ajouter un endpoint"
3. URL : `https://votre-domaine.vercel.app/api/stripe/webhook`
4. Version : Dernière version
5. Événements à écouter :
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
6. Copiez le secret du webhook (commence par `whsec_`)
7. Ajoutez-le dans les variables d'environnement Vercel

## 🔒 Sécurité en production

### 1. Rate Limiting

Installez et configurez un rate limiter :

```bash
npm install @upstash/ratelimit @upstash/redis
```

Créez un compte sur [Upstash](https://upstash.com) pour Redis.

### 2. Variables sensibles

- ⚠️ Ne commitez JAMAIS le fichier `.env`
- ✅ Utilisez des secrets différents pour chaque environnement
- ✅ Régénérez tous les secrets pour la production

### 3. CORS et Headers

Vercel configure automatiquement les headers de sécurité, mais vous pouvez les personnaliser dans `next.config.js`.

## 📊 Monitoring et Logs

### Vercel Analytics (inclus)

- Les analytics sont automatiquement activés sur Vercel
- Consultez-les dans l'onglet "Analytics" de votre projet

### Sentry (recommandé pour les erreurs)

```bash
npm install @sentry/nextjs

# Suivre le guide d'installation
npx @sentry/wizard@latest -i nextjs
```

### Logs Stripe

- Activez les logs détaillés dans le dashboard Stripe
- Configurez des alertes email pour les paiements échoués

## 🎯 Performance

### 1. Optimisations automatiques de Vercel

- Edge caching
- Image optimization
- Compression automatique

### 2. Optimisations à faire

```typescript
// next.config.js
module.exports = {
  // Compression
  compress: true,
  
  // Headers de cache
  async headers() {
    return [
      {
        source: '/api/v1/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};
```

## 🧪 Tester en production

### 1. Tester l'authentification

1. Créez un nouveau compte
2. Vérifiez que vous recevez l'email (si configuré)
3. Testez la connexion/déconnexion

### 2. Tester les paiements

1. Utilisez une vraie carte (montant minimum)
2. Vérifiez que les crédits sont bien ajoutés
3. Testez le webhook en vérifiant les logs Stripe

### 3. Tester l'API

```bash
curl -X GET "https://votre-domaine.vercel.app/api/v1/product-crawl?url=https://example.com/product" \
  -H "X-API-Key: votre_cle_api_production"
```

## 🔄 Mises à jour

### Déploiement continu

Avec Vercel, chaque push sur `main` déclenche un déploiement automatique.

### Migrations de base de données

Pour les migrations critiques :

```bash
# 1. Créer la migration en local
npx prisma migrate dev --name nouvelle_migration

# 2. Pousser sur GitHub
git add .
git commit -m "Migration: nouvelle_migration"
git push

# 3. Appliquer en production (via console Vercel ou localement)
DATABASE_URL="votre_url_prod" npx prisma migrate deploy
```

## 📱 Domaine personnalisé

### Configurer un domaine sur Vercel

1. Dans Settings > Domains de votre projet
2. Ajoutez votre domaine
3. Suivez les instructions DNS
4. Mettez à jour `NEXTAUTH_URL` avec votre domaine
5. Mettez à jour l'URL du webhook Stripe

## 🆘 Rollback en cas de problème

### Via Vercel

1. Allez dans l'onglet "Deployments"
2. Sélectionnez un déploiement précédent
3. Cliquez sur les 3 points > "Promote to Production"

### Via Git

```bash
git revert HEAD
git push
```

## 📋 Checklist post-déploiement

- [ ] L'application est accessible via HTTPS
- [ ] Les utilisateurs peuvent créer un compte
- [ ] Les utilisateurs peuvent se connecter
- [ ] Les clés API peuvent être créées
- [ ] Les paiements fonctionnent
- [ ] Les webhooks Stripe fonctionnent
- [ ] Les crédits sont bien déduits à chaque appel
- [ ] Les factures sont accessibles
- [ ] Le portail client Stripe fonctionne
- [ ] Les erreurs sont loggées
- [ ] Les backups de base de données sont configurés

## 🎉 C'est en ligne !

Votre plateforme SaaS est maintenant en production ! 🚀

### Prochaines étapes

1. **Marketing** : Faites connaître votre API
2. **Support** : Mettez en place un système de support client
3. **Analytics** : Suivez l'utilisation et les conversions
4. **Améliorations** : Écoutez les retours utilisateurs

### Ressources utiles

- [Documentation Vercel](https://vercel.com/docs)
- [Stripe Production Checklist](https://stripe.com/docs/checklist)
- [Best Practices Next.js](https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist)

Bon succès avec votre SaaS ! 💪

