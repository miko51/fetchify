# 🔍 Comment Trouver la DATABASE_URL dans Supabase

Guide mis à jour pour trouver votre URL de connexion PostgreSQL dans Supabase.

---

## 🎯 MÉTHODE 1 : Via "Project Settings" (Recommandé)

### Étape par étape :

1. **Connectez-vous à Supabase** : https://app.supabase.com

2. **Sélectionnez votre projet** : Cliquez sur votre projet `fetchify`

3. **Cliquez sur l'icône ⚙️ "Settings"** (en bas à gauche dans la barre latérale)

4. **Dans le menu Settings, cliquez sur "Database"**
   - Vous devriez voir plusieurs onglets en haut

5. **Scrollez vers le bas** jusqu'à voir la section **"Connection pooling"** ou **"Connection string"**

6. **Cherchez "Connection Pooling" ou "Session Pooler"**
   - Vous verrez plusieurs modes : `Transaction`, `Session`, `Supavisor`

7. **Sélectionnez le mode "Session"** ou **"Transaction"**

8. **Cliquez sur "Connection string"** → **"URI"**

9. **Vous verrez une URL comme :**
```
postgresql://postgres.xxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

10. **Cochez "Display password"** (si disponible) pour voir le mot de passe

---

## 🎯 MÉTHODE 2 : Via "Database" dans le menu principal

### Étape par étape :

1. **Dans le menu de gauche, cliquez directement sur "Database"** (icône 🗄️)

2. **Cherchez un onglet ou bouton "Connection"** en haut

3. **Ou scrollez vers le bas** pour trouver "Connection info" ou "Connection pooling"

4. **Cliquez sur "Connection info"**

5. **Vous verrez les informations de connexion :**
   - Host
   - Database name
   - Port
   - User
   - Password (caché par défaut)

6. **Reconstituez l'URL manuellement** :
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[HOST]:[PORT]/postgres
```

---

## 🎯 MÉTHODE 3 : Via "Connect" ou "SQL Editor"

### Étape par étape :

1. **Cliquez sur "SQL Editor"** dans le menu de gauche

2. **Cherchez un bouton "Connect"** ou "Connection" en haut à droite

3. **Cliquez dessus**

4. **Vous verrez plusieurs options de connexion**

5. **Cherchez "Connection pooler"** ou **"Postgres connection string"**

6. **Copiez l'URI fournie**

---

## 🎯 MÉTHODE 4 : Construction Manuelle (Si vous ne trouvez pas l'URI)

Si vous ne trouvez pas l'URI complète, vous pouvez la construire avec les informations individuelles :

### 4.1 - Récupérer les informations

**Dans Settings → Database**, vous devriez voir :

```
Host: aws-0-eu-central-1.pooler.supabase.com
Database name: postgres
Port: 6543 (pour pooler) ou 5432 (direct)
User: postgres.xxxxxxxxxxxxxxxx
Password: [votre mot de passe créé lors de la création du projet]
```

### 4.2 - Construire l'URL

**Format** :
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**Exemple** :
```
postgresql://postgres.abcdefghijklmnop:MonMotDePasse123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**⚠️ Utilisez le port 6543 (pooler) et non 5432 (direct) pour Vercel/production**

---

## 🎯 MÉTHODE 5 : Via l'API Supabase

### Récupérer depuis le Project Settings

1. **Settings** (⚙️) → **API**

2. **Vous verrez "Project URL"** et **"API URL"**

3. **Mais pour la DATABASE_URL**, revenez à **Settings → Database**

---

## 📸 Capture d'écran : Où chercher

```
┌─────────────────────────────────────┐
│  Supabase Dashboard                 │
├─────────────────────────────────────┤
│                                     │
│  [Votre Projet]                     │
│                                     │
│  Menu latéral (gauche):             │
│  📊 Home                            │
│  📝 Table Editor                    │
│  🔧 SQL Editor                      │
│  🗄️  Database          ← CLIQUEZ ICI│
│  🔐 Authentication                  │
│  📦 Storage                         │
│  ⚙️  Settings          ← OU ICI    │
│      ├─ General                     │
│      ├─ Database       ← PUIS ICI  │
│      ├─ API                         │
│      └─ Billing                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔑 Si vous avez perdu votre mot de passe

**Vous ne pouvez PAS récupérer le mot de passe**, mais vous pouvez :

### Option A : Réinitialiser le mot de passe

1. **Settings → Database**
2. Cherchez **"Database password"** ou **"Reset database password"**
3. Cliquez sur **"Generate new password"** ou **"Reset password"**
4. **Copiez et sauvegardez** le nouveau mot de passe
5. ⚠️ **Attention** : Cela va casser toutes les connexions existantes !

### Option B : Créer un nouvel utilisateur

1. **SQL Editor**
2. Exécutez cette commande :
```sql
CREATE USER fetchify_user WITH PASSWORD 'VotreNouveauMotDePasse';
GRANT ALL PRIVILEGES ON DATABASE postgres TO fetchify_user;
```
3. Utilisez `fetchify_user` dans votre DATABASE_URL

---

## ✅ Vérifier que votre URL fonctionne

### Test 1 : Avec psql (si installé)

```bash
psql "postgresql://postgres.xxxxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

**Sortie attendue** :
```
psql (14.x)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=>
```

### Test 2 : Avec Prisma

```bash
# Créez .env.local avec votre DATABASE_URL
echo 'DATABASE_URL="postgresql://..."' > .env.local

# Testez la connexion
npx prisma db pull
```

**Sortie attendue** :
```
Introspecting based on datasource defined in prisma/schema.prisma
✔ Introspected 0 models and wrote them into prisma/schema.prisma in XXXms
```

---

## 🎯 Format Final de la DATABASE_URL

Votre URL finale doit ressembler à ça :

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOST]:6543/postgres"
```

**Exemple concret** :
```env
DATABASE_URL="postgresql://postgres.abcdefghijklmnopqrst:MySecurePassword123!@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
```

**Composants** :
- `postgresql://` = Protocole
- `postgres.abcdefghijklmnopqrst` = Utilisateur (postgres + référence projet)
- `MySecurePassword123!` = Mot de passe (celui créé lors de la création du projet)
- `aws-0-eu-central-1.pooler.supabase.com` = Host (région EU Central)
- `6543` = Port (pooler, recommandé pour Vercel)
- `postgres` = Nom de la base de données

---

## 🚨 Problèmes courants

### "Je vois plusieurs URLs différentes"

Supabase propose plusieurs types de connexions :

1. **Pooler (port 6543)** ← **Utilisez celui-ci pour Vercel**
   - `pooler.supabase.com:6543`
   - Supporte plus de connexions simultanées

2. **Direct (port 5432)** ← Pour développement local uniquement
   - `db.supabase.com:5432`
   - Connexion directe

**Utilisez toujours le POOLER (6543) pour la production !**

### "L'URL contient [YOUR-PASSWORD]"

C'est normal ! Vous devez **remplacer** `[YOUR-PASSWORD]` par le vrai mot de passe.

**Avant** :
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@...
```

**Après** :
```
postgresql://postgres.xxxxx:MonVraiMotDePasse@...
```

---

## 📞 Dernière option : Support Supabase

Si vous ne trouvez toujours pas :

1. **Discord Supabase** : https://discord.supabase.com
   - Canal `#help`
   - Très réactif

2. **Documentation** : https://supabase.com/docs/guides/database/connecting-to-postgres

3. **GitHub Discussions** : https://github.com/supabase/supabase/discussions

---

## 💡 Alternative : Utiliser les variables d'environnement de Supabase

Si vous utilisez Supabase CLI :

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier votre projet
supabase link --project-ref YOUR_PROJECT_REF

# Récupérer la DATABASE_URL
supabase db dump --data-only
```

---

**Une fois que vous avez votre DATABASE_URL, créez le fichier `.env.local` :**

```bash
echo 'DATABASE_URL="postgresql://..."' > .env.local
```

**Et continuez avec** : `MIGRATION_SQLITE_TO_POSTGRESQL.md` ! 🚀
