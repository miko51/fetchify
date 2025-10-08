# 🚀 Comment obtenir l'URL du Pooler pour Vercel

Guide rapide pour récupérer la bonne DATABASE_URL pour votre déploiement Vercel.

---

## ⚠️ Pourquoi le Pooler est obligatoire pour Vercel ?

**Problème avec la connexion directe** :
- Vercel crée **une nouvelle connexion** pour chaque requête serverless
- PostgreSQL limite les connexions à ~25 en même temps
- Votre app va **crasher** dès qu'il y a du trafic

**Solution avec le Pooler** :
- Supporte 200+ connexions simultanées
- Optimisé pour les environnements serverless
- **Gratuit** sur Supabase

---

## 📍 Étapes pour obtenir l'URL du Pooler

### 1. Allez sur votre dashboard Supabase
```
https://app.supabase.com/project/bklfpburxuluzkrtqyoa
```

### 2. Cliquez sur "Database" dans le menu de gauche
**(PAS "Settings" → "Database", mais directement "Database")**

### 3. Cliquez sur "Connection" en haut
Vous verrez plusieurs onglets en haut de la page

### 4. Sélectionnez le mode "Transaction"
Vous verrez 3 modes :
- **Transaction** ← **Recommandé pour Vercel** ✅
- Session
- Supavisor (nouveau)

**Pourquoi Transaction ?**
- Optimisé pour les requêtes courtes (API)
- Plus de connexions disponibles
- Parfait pour Next.js/Vercel

### 5. Cliquez sur l'onglet "URI"
Vous verrez :
```
[PSQL] [URI] [.env]
        ↑
    CLIQUEZ ICI
```

### 6. Copiez l'URL complète
Vous devriez voir quelque chose comme :
```
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Vérifiez que l'URL contient :**
- ✅ `pooler.supabase.com` (pas juste `supabase.co`)
- ✅ Port `6543` (pas `5432`)
- ✅ Votre mot de passe (pas `[YOUR-PASSWORD]`)

---

## 📋 Format de l'URL du Pooler

### Anatomie de l'URL :

```
postgresql://postgres.PROJECT_REF:PASSWORD@HOST:6543/postgres
```

### Votre URL spécifique :

```
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Composants :**
- `postgres.bklfpburxuluzkrtqyoa` = User (avec project ref)
- `pjEpd5OClWhhngDL` = Votre mot de passe
- `aws-0-eu-central-1.pooler.supabase.com` = Host du pooler
- `6543` = Port du pooler (important!)
- `postgres` = Nom de la base de données

---

## 🎛️ Configuration dans Vercel

### Étape 1 : Connecter votre repo GitHub à Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "New Project"
3. Importez votre repo GitHub
4. **Ne déployez pas encore !**

### Étape 2 : Ajouter les variables d'environnement

Dans **Settings → Environment Variables**, ajoutez :

```env
DATABASE_URL
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

NEXTAUTH_URL
https://fetchify.app

NEXTAUTH_SECRET
htuYCqpYiJyi1JIpBASWxajsai+yO9k5+7raCucIlpE=

STRIPE_SECRET_KEY
sk_live_VOTRE_CLE_LIVE

STRIPE_PUBLISHABLE_KEY
pk_live_VOTRE_CLE_LIVE

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
pk_live_VOTRE_CLE_LIVE

STRIPE_WEBHOOK_SECRET
whsec_VOTRE_WEBHOOK_SECRET

API_ENDPOINT
https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9
```

**⚠️ Important :**
- Cochez "Production", "Preview", et "Development" pour chaque variable
- Remplacez les clés Stripe de test (`sk_test_...`) par les clés live (`sk_live_...`)

### Étape 3 : Déployer

1. Cliquez sur "Deploy"
2. Attendez que le build se termine
3. Testez votre application !

---

## 🧪 Tester la connexion du Pooler localement

Avant de déployer sur Vercel, testez l'URL du pooler en local :

### 1. Mettez à jour votre `.env` :

```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# ... autres variables ...
EOF
```

### 2. Testez la connexion :

```bash
npx prisma db pull
```

**Succès attendu :**
```
✔ Introspected X models and wrote them into prisma/schema.prisma
```

**Erreur possible :**
```
Error: Tenant or user not found
```

**Solution :**
- Revérifiez l'URL copiée depuis Supabase
- Assurez-vous d'avoir sélectionné le bon mode (Transaction)
- Vérifiez que le mot de passe est correct

### 3. Relancez l'application :

```bash
lsof -ti:3005 | xargs kill -9
PORT=3005 npm run dev
```

Si tout fonctionne, l'URL du pooler est correcte ! ✅

---

## 🔄 Différences entre les modes

| Mode | Port | Usage | Connexions max |
|------|------|-------|----------------|
| **Direct** | 5432 | Dev local uniquement | ~25 |
| **Transaction** | 6543 | **Vercel/Production** ✅ | 200+ |
| **Session** | 6543 | Connexions longues | 100+ |

**Pour Vercel, utilisez TOUJOURS Transaction (port 6543) !**

---

## ❌ Erreurs courantes

### Erreur 1 : "Too many connections"

**Cause** : Vous utilisez la connexion directe (port 5432)

**Solution** : Passez au pooler (port 6543)

```diff
- postgresql://...supabase.co:5432/postgres
+ postgresql://...pooler.supabase.com:6543/postgres
```

### Erreur 2 : "Tenant or user not found"

**Cause** : L'URL du pooler est incorrecte

**Solution** :
1. Retournez sur Supabase → Database → Connection
2. Vérifiez que vous êtes bien en mode "Transaction"
3. Re-copiez l'URL exacte depuis l'onglet "URI"

### Erreur 3 : "prepared statement already exists"

**Cause** : PgBouncer en mode transaction ne supporte pas les prepared statements

**Solution** : Ajoutez `?pgbouncer=true` à l'URL :

```
postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true
```

Prisma détectera automatiquement PgBouncer et désactivera les prepared statements.

---

## 📸 Capture d'écran : Où trouver le Pooler

```
┌─────────────────────────────────────────────────┐
│  Supabase Dashboard                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  Menu (gauche):                                 │
│  📊 Home                                        │
│  📝 Table Editor                                │
│  🗄️  Database          ← CLIQUEZ ICI           │
│                                                 │
│  Page Database:                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ [Tables] [Roles] [Connection]            │  │
│  │                   ↑↑↑↑↑↑↑↑↑↑               │  │
│  │                CLIQUEZ ICI                 │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Connection:                                    │
│  ┌───────────────────────────────────────────┐  │
│  │ Mode:                                     │  │
│  │ [Transaction] [Session] [Supavisor]      │  │
│  │  ↑↑↑↑↑↑↑↑↑↑↑                               │  │
│  │ SÉLECTIONNEZ TRANSACTION                  │  │
│  │                                           │  │
│  │ Connection string:                        │  │
│  │ [PSQL] [URI] [.env]                      │  │
│  │         ↑↑↑                               │  │
│  │     CLIQUEZ ICI                           │  │
│  │                                           │  │
│  │ postgresql://postgres.xxx:pwd@...        │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist finale

Avant de déployer sur Vercel, vérifiez :

- [ ] ✅ L'URL contient `pooler.supabase.com`
- [ ] ✅ Le port est `6543` (pas 5432)
- [ ] ✅ Le mode est "Transaction"
- [ ] ✅ Le mot de passe est présent (pas `[YOUR-PASSWORD]`)
- [ ] ✅ L'URL a été testée localement avec `npx prisma db pull`
- [ ] ✅ L'application fonctionne localement avec cette URL
- [ ] ✅ Les clés Stripe sont en mode **live** (pas test) pour production

---

## 🎉 Une fois configuré

Votre application Fetchify sera :
- ✅ Scalable (supporte des milliers d'utilisateurs)
- ✅ Rapide (connexions poolées)
- ✅ Stable (pas de crash de connexion)
- ✅ Prête pour la production !

**N'oubliez pas de configurer aussi les webhooks Stripe vers votre domaine Vercel ! 🚀**

---

## 📚 Ressources

- **Guide de déploiement complet** : `DEPLOIEMENT_VERCEL_SUPABASE.md`
- **Documentation Supabase Pooler** : https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- **Prisma + Supabase** : https://www.prisma.io/docs/guides/database/supabase
- **Vercel Environment Variables** : https://vercel.com/docs/concepts/projects/environment-variables

