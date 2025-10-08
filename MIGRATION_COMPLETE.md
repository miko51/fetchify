# ✅ Migration SQLite → PostgreSQL Complétée !

Migration réussie vers Supabase PostgreSQL le 8 octobre 2025.

---

## 🎉 Ce qui a été fait

### ✅ 1. Configuration de Supabase
- Projet créé : `bklfpburxuluzkrtqyoa`
- Base de données PostgreSQL configurée
- DATABASE_URL récupérée

### ✅ 2. Migration du schéma Prisma
**Changements dans `prisma/schema.prisma` :**

```prisma
datasource db {
  provider = "postgresql"  // Changé de "sqlite"
  url      = env("DATABASE_URL")
}

model ApiUsage {
  // ...
  response    Json?  // Changé de String?
  // ...
}
```

### ✅ 3. Mise à jour des fichiers de configuration
**`.env` mis à jour :**
```env
DATABASE_URL="postgresql://postgres:pjEpd5OClWhhngDL@db.bklfpburxuluzkrtqyoa.supabase.co:5432/postgres"
```

### ✅ 4. Création des tables
```bash
npx prisma db push
```
Résultat : Toutes les tables créées avec succès dans Supabase !

### ✅ 5. Seeding des données
```bash
npx tsx prisma/seed.ts
```
Résultat : 3 credit packages créés (Starter, Pro, Enterprise)

### ✅ 6. Application lancée
```bash
PORT=3005 npm run dev
```
L'application tourne maintenant sur http://localhost:3005 avec PostgreSQL !

---

## 🔐 Informations de connexion

### Connexion Actuelle (Développement)

**Type** : Connexion directe  
**Port** : 5432  
**URL** :
```
postgresql://postgres:pjEpd5OClWhhngDL@db.bklfpburxuluzkrtqyoa.supabase.co:5432/postgres
```

✅ **Parfait pour le développement local**

---

## 🚀 Pour la PRODUCTION (Vercel)

### ⚠️ IMPORTANT : Utiliser le POOLER

Pour Vercel et la production, vous **DEVEZ** utiliser la connexion pooler (port 6543) au lieu de la connexion directe (port 5432).

### Comment obtenir l'URL du Pooler :

1. **Allez sur Supabase** : https://app.supabase.com
2. **Cliquez sur "Database"** dans le menu de gauche (pas Settings!)
3. **Cliquez sur "Connection"** ou "Connect" en haut
4. **Sélectionnez le mode "Transaction"** (recommandé pour Vercel) ou "Session"
5. **Cliquez sur l'onglet "URI"**
6. **Copiez l'URL complète** qui devrait ressembler à :

```
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Pourquoi le Pooler ?

| Aspect | Direct (5432) | Pooler (6543) |
|--------|---------------|---------------|
| **Connexions** | Limitées (~25) | Beaucoup plus (~200+) |
| **Serverless** | ❌ Pas adapté | ✅ Optimisé |
| **Vercel** | ❌ Peut crasher | ✅ Recommandé |
| **Prix** | Gratuit | Gratuit |

**Vercel crée de nombreuses connexions simultanées** (une par fonction serverless), donc le pooler est indispensable !

---

## 📋 Variables d'environnement pour Vercel

Quand vous déployez sur Vercel, ajoutez ces variables :

### Dans Vercel Dashboard → Settings → Environment Variables :

```env
# Database (UTILISEZ LE POOLER !)
DATABASE_URL=postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true

# NextAuth
NEXTAUTH_URL=https://fetchify.app
NEXTAUTH_SECRET=htuYCqpYiJyi1JIpBASWxajsai+yO9k5+7raCucIlpE=

# Stripe (PASSEZ EN MODE LIVE !)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# API
API_ENDPOINT=https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9
```

---

## 🧪 Test de l'application

### 1. Vérifier que l'app tourne :
```bash
# Ouvrez dans votre navigateur
http://localhost:3005
```

### 2. Créer un compte
1. Cliquez sur "Sign Up"
2. Créez un compte avec votre email
3. Connectez-vous

### 3. Vérifier les données dans Supabase

**Option A : Via Prisma Studio**
```bash
npm run db:studio
```
→ Ouvre http://localhost:5555 pour voir vos données

**Option B : Via Supabase Dashboard**
1. Allez sur https://app.supabase.com
2. Cliquez sur "Table Editor"
3. Vous devriez voir toutes vos tables : users, api_keys, credit_packages, etc.

### 4. Tester un achat de crédits
1. Allez dans "Credits"
2. Cliquez sur "Acheter" sur un pack
3. Utilisez une carte de test Stripe : `4242 4242 4242 4242`
4. Vérifiez que vos crédits augmentent

---

## 🔄 Commandes utiles

### Voir les données
```bash
npm run db:studio
```

### Réinitialiser la base de données
```bash
npx prisma db push --force-reset
npm run db:seed
```

### Créer une nouvelle migration
```bash
npx prisma migrate dev --name nom_migration
```

### Déployer le schéma sur production
```bash
npx prisma db push
```

---

## 🆘 Dépannage

### Erreur : "Too many connections"

**Problème** : Vous utilisez la connexion directe au lieu du pooler.

**Solution** : Utilisez l'URL du pooler (port 6543) :
```env
DATABASE_URL="postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Erreur : "Tenant or user not found"

**Problème** : L'URL du pooler est incorrecte.

**Solution** :
1. Retournez sur Supabase → Database → Connection
2. Vérifiez le mode (Transaction ou Session)
3. Copiez exactement l'URL fournie

### Erreur : "SSL required"

**Solution** : Ajoutez `?sslmode=require` à la fin de l'URL :
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

### L'application ne se connecte pas

**Solution** :
1. Vérifiez que `.env` contient la bonne DATABASE_URL
2. Relancez le serveur :
   ```bash
   lsof -ti:3005 | xargs kill -9
   PORT=3005 npm run dev
   ```

---

## 📊 Vérifier que tout fonctionne

### Checklist finale :

- [ ] ✅ Application se lance sur http://localhost:3005
- [ ] ✅ Vous pouvez créer un compte
- [ ] ✅ Vous pouvez vous connecter
- [ ] ✅ Le dashboard s'affiche correctement
- [ ] ✅ Les credit packages sont visibles dans "Credits"
- [ ] ✅ Vous pouvez créer une API key dans "API Keys"
- [ ] ✅ Les données sont visibles dans Supabase (Table Editor)

---

## 🎯 Prochaines étapes

### 1. Tester l'application localement
→ Faites un tour complet de toutes les fonctionnalités

### 2. Obtenir l'URL du pooler
→ Suivez les instructions ci-dessus pour récupérer l'URL avec le port 6543

### 3. Déployer sur Vercel
→ Suivez le guide `DEPLOIEMENT_VERCEL_SUPABASE.md`

### 4. Configurer les webhooks Stripe
→ Pointez les webhooks vers votre domaine Vercel

### 5. Passer Stripe en mode Live
→ Remplacez les clés `sk_test_...` par `sk_live_...`

---

## 📚 Ressources

- **Supabase Dashboard** : https://app.supabase.com/project/bklfpburxuluzkrtqyoa
- **Documentation Supabase** : https://supabase.com/docs/guides/database
- **Prisma + Supabase** : https://www.prisma.io/docs/guides/database/supabase
- **Guide de déploiement** : Voir `DEPLOIEMENT_VERCEL_SUPABASE.md`
- **Migration SQLite → PostgreSQL** : Voir `MIGRATION_SQLITE_TO_POSTGRESQL.md`

---

## 🎉 Félicitations !

Votre application Fetchify est maintenant connectée à une vraie base de données PostgreSQL hébergée sur Supabase !

**Avantages obtenus :**
- ✅ Base de données scalable
- ✅ Backups automatiques
- ✅ Interface d'administration (Supabase Dashboard)
- ✅ Support PostgreSQL natif (Json, etc.)
- ✅ Prêt pour la production

**Testez maintenant votre application locale et assurez-vous que tout fonctionne avant de déployer sur Vercel ! 🚀**

