# 🔄 Migration SQLite → PostgreSQL (Supabase)

Guide détaillé pour migrer votre base de données SQLite locale vers PostgreSQL sur Supabase.

---

## 📋 Vue d'ensemble

Actuellement, votre application utilise **SQLite** (base de données locale, fichier `prisma/dev.db`).

Pour déployer en production, vous devez migrer vers **PostgreSQL** (base de données cloud sur Supabase).

---

## 🗄️ ÉTAPE 1 : Récupérer la DATABASE_URL de Supabase

### 1.1 - Créer un projet Supabase

1. **Allez sur** : https://supabase.com
2. **Cliquez sur** : `Start your project` ou `New Project`
3. **Remplissez le formulaire** :

```
Organization: Créez-en une si c'est votre premier projet
Project name: fetchify
Database Password: [GÉNÉREZ UN MOT DE PASSE FORT]
Region: Europe Central (Frankfurt) ou Europe West (Paris)
Pricing Plan: Free (parfait pour commencer)
```

⚠️ **TRÈS IMPORTANT** : **Copiez et sauvegardez** le mot de passe de la base de données quelque part de sûr (notes, gestionnaire de mots de passe, etc.). Vous en aurez besoin !

4. **Cliquez sur** : `Create new project`
5. **Attendez 2-3 minutes** que le projet se crée

### 1.2 - Trouver la DATABASE_URL

Une fois le projet créé :

1. **Dans le menu de gauche, cliquez sur** : ⚙️ `Settings` (tout en bas)
2. **Cliquez sur** : `Database` (dans le sous-menu)
3. **Scrollez vers le bas** jusqu'à la section **"Connection string"**
4. **Cliquez sur l'onglet** : `URI`
5. **Vous verrez une URL comme celle-ci** :

```
postgresql://postgres.xxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

6. **IMPORTANT** : Cette URL contient `[YOUR-PASSWORD]` qu'il faut remplacer !

### 1.3 - Copier la DATABASE_URL complète

**Méthode 1 : Copie manuelle**

1. **Cliquez sur le bouton "Copy"** à droite de l'URI
2. **Collez-la** dans un éditeur de texte
3. **Remplacez** `[YOUR-PASSWORD]` par le mot de passe que vous avez créé à l'étape 1.1
4. **Exemple final** :

```
postgresql://postgres.abcdefghijklmnop:MonMotDePasseSecurise123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Méthode 2 : Génération automatique (recommandé)**

1. Au lieu de l'onglet `URI`, cliquez sur l'onglet `Session pooler`
2. Cochez **"Display password"**
3. **Copiez l'URI complète** qui apparaît (le mot de passe est déjà dedans)

### 1.4 - Sauvegarder la DATABASE_URL

**Créez un fichier `.env.local`** à la racine de votre projet :

```bash
# Dans votre terminal, à la racine du projet :
touch .env.local
```

**Ouvrez `.env.local`** et ajoutez :

```env
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MonMotDePasseSecurise123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

⚠️ **N'oubliez pas les guillemets** autour de l'URL !

---

## 🔧 ÉTAPE 2 : Modifier le schéma Prisma

### 2.1 - Comprendre le changement

**Actuellement**, votre `prisma/schema.prisma` ressemble à ça :

```prisma
datasource db {
  provider = "sqlite"  // ← Base de données SQLite (fichier local)
  url      = env("DATABASE_URL")
}
```

**Il faut changer en** :

```prisma
datasource db {
  provider = "postgresql"  // ← Base de données PostgreSQL (Supabase)
  url      = env("DATABASE_URL")
}
```

### 2.2 - Ouvrir le fichier

**Option 1 : Avec votre éditeur de code**
- Ouvrez le fichier `prisma/schema.prisma`

**Option 2 : Avec la ligne de commande**
```bash
code prisma/schema.prisma
# ou
nano prisma/schema.prisma
# ou
vim prisma/schema.prisma
```

### 2.3 - Modifier le provider

**Avant** :
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Après** :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

⚠️ **C'EST TOUT !** Juste une seule ligne à changer : `"sqlite"` → `"postgresql"`

### 2.4 - Modifier les types de données (important pour PostgreSQL)

SQLite et PostgreSQL ont des types différents. Voici les modifications à faire :

#### A. Le champ `response` dans `ApiUsage`

**Avant (SQLite)** :
```prisma
model ApiUsage {
  // ... autres champs ...
  response    String?  // SQLite ne supporte pas Json, donc on utilisait String
  // ... autres champs ...
}
```

**Après (PostgreSQL)** :
```prisma
model ApiUsage {
  // ... autres champs ...
  response    Json?    // PostgreSQL supporte nativement Json !
  // ... autres champs ...
}
```

#### B. Vérification complète du schéma

Voici le **schéma complet et correct** pour PostgreSQL :

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
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
  response      Json?     // ← CHANGÉ de String? à Json?
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

### 2.5 - Sauvegarder le fichier

**Sauvegardez** le fichier `prisma/schema.prisma` avec vos modifications.

---

## ✅ ÉTAPE 3 : Tester la connexion à Supabase

### 3.1 - Générer le client Prisma

```bash
npx prisma generate
```

**Sortie attendue** :
```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client in 123ms
```

### 3.2 - Pousser le schéma vers Supabase

```bash
npx prisma db push
```

**Sortie attendue** :
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public"

🚀  Your database is now in sync with your Prisma schema. Done in 1.23s

✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client in 87ms
```

✅ **Si vous voyez ça, c'est bon !** Les tables ont été créées dans Supabase.

### 3.3 - Vérifier dans Supabase

1. **Retournez sur** : https://app.supabase.com
2. **Ouvrez votre projet** `fetchify`
3. **Cliquez sur** : 🗄️ `Database` (dans le menu de gauche)
4. **Cliquez sur** : `Tables`
5. **Vous devriez voir** :
   - `users`
   - `api_keys`
   - `api_usage`
   - `purchases`
   - `credit_packages`

🎉 **Parfait !** Votre base de données est créée.

---

## 📊 ÉTAPE 4 : Seeder les données

### 4.1 - Qu'est-ce que le seeding ?

Le seeding consiste à **peupler la base de données** avec des données initiales (comme les packs de crédits).

### 4.2 - Exécuter le seed

```bash
npm run db:seed
```

**Sortie attendue** :
```
🌱 Seeding database...
✅ 3 packs de crédits créés
🎉 Seeding terminé !
```

### 4.3 - Vérifier les données

**Dans Supabase** :
1. `Database` → `Tables` → `credit_packages`
2. Cliquez sur la table
3. Vous devriez voir **3 lignes** avec les packs de crédits (Starter, Pro, Business)

---

## 🔄 ÉTAPE 5 : Migrer les données existantes (optionnel)

Si vous avez déjà des utilisateurs et des données dans SQLite, voici comment les migrer.

### 5.1 - Exporter depuis SQLite

```bash
# Installer sqlite3
npm install -D sqlite3

# Exporter les données
npx prisma db pull --schema=prisma/schema.sqlite.prisma
```

### 5.2 - Script de migration

Créez un fichier `migrate-data.ts` :

```typescript
import { PrismaClient as SQLiteClient } from '@prisma/client-sqlite';
import { PrismaClient as PostgresClient } from '@prisma/client';

const sqlite = new SQLiteClient({
  datasources: {
    db: { url: 'file:./prisma/dev.db' }
  }
});

const postgres = new PostgresClient();

async function migrateData() {
  console.log('🔄 Migration en cours...');

  // Migrer les utilisateurs
  const users = await sqlite.user.findMany();
  for (const user of users) {
    await postgres.user.create({ data: user });
  }
  console.log(`✅ ${users.length} utilisateurs migrés`);

  // Migrer les clés API
  const apiKeys = await sqlite.apiKey.findMany();
  for (const key of apiKeys) {
    await postgres.apiKey.create({ data: key });
  }
  console.log(`✅ ${apiKeys.length} clés API migrées`);

  // etc...

  console.log('🎉 Migration terminée !');
  await sqlite.$disconnect();
  await postgres.$disconnect();
}

migrateData().catch(console.error);
```

**Exécutez** :
```bash
npx ts-node migrate-data.ts
```

---

## 🧪 ÉTAPE 6 : Tester l'application

### 6.1 - Démarrer le serveur

```bash
npm run dev
```

### 6.2 - Tester les fonctionnalités

1. **Créez un compte** : http://localhost:3005/fr/auth/signup
2. **Connectez-vous**
3. **Générez une clé API**
4. **Testez un achat de crédits**
5. **Vérifiez** que tout fonctionne !

### 6.3 - Vérifier les données dans Supabase

Après chaque action, vérifiez dans Supabase que les données sont bien enregistrées :

- Nouveau compte → Table `users`
- Nouvelle clé API → Table `api_keys`
- Achat de crédits → Table `purchases`
- Appel API → Table `api_usage`

---

## 🚨 Résolution de problèmes

### Problème 1 : "Error: P1001: Can't reach database server"

**Cause** : La DATABASE_URL est incorrecte ou le mot de passe est faux.

**Solution** :
1. Vérifiez que vous avez bien remplacé `[YOUR-PASSWORD]`
2. Vérifiez qu'il n'y a pas d'espace dans l'URL
3. Vérifiez que les guillemets sont présents dans `.env.local`

### Problème 2 : "Error: P3009: Failed to create database"

**Cause** : Problème de permissions ou de connexion.

**Solution** :
1. Utilisez le **pooler** (port 6543, pas 5432)
2. Vérifiez que votre IP est autorisée dans Supabase (par défaut toutes les IPs sont autorisées)

### Problème 3 : "Type 'Json' is not supported"

**Cause** : Le provider est toujours sur "sqlite".

**Solution** :
1. Vérifiez `prisma/schema.prisma` : `provider = "postgresql"`
2. Exécutez `npx prisma generate` pour régénérer le client

---

## 📋 Checklist complète

Avant de passer en production, vérifiez :

- [ ] Projet Supabase créé
- [ ] DATABASE_URL copiée et testée
- [ ] `prisma/schema.prisma` modifié (provider = "postgresql")
- [ ] Champ `response` changé de `String?` à `Json?`
- [ ] `.env.local` créé avec la DATABASE_URL
- [ ] `npx prisma generate` exécuté
- [ ] `npx prisma db push` exécuté avec succès
- [ ] Tables visibles dans Supabase
- [ ] `npm run db:seed` exécuté
- [ ] Données de seed visibles dans Supabase
- [ ] Application testée en local avec Supabase
- [ ] Toutes les fonctionnalités testées (signup, API keys, achats)

---

## 🎯 Prochaines étapes

Une fois cette migration terminée :

1. ✅ Votre application fonctionne avec PostgreSQL
2. ✅ Vous êtes prêt pour le déploiement sur Vercel
3. ✅ Vous pouvez supprimer le fichier SQLite : `prisma/dev.db`

**Continuez avec** : `DEPLOIEMENT_VERCEL_SUPABASE.md` pour déployer sur Vercel !

---

## 💡 Conseils

### Garder SQLite pour le développement local

Vous pouvez créer **deux schémas Prisma** :

**1. `prisma/schema.prisma`** (PostgreSQL pour production) :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**2. `prisma/schema.sqlite.prisma`** (SQLite pour dev local) :
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

**Switcher entre les deux** :
```bash
# Dev local avec SQLite
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# Production avec PostgreSQL
cp prisma/schema.postgres.prisma prisma/schema.prisma
```

---

**Voilà ! Vous êtes maintenant sur PostgreSQL avec Supabase ! 🎉**
