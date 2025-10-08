# 🎯 Instructions Exactes pour Trouver la DATABASE_URL

Basé sur votre capture d'écran actuelle.

---

## ✅ ÉTAPES EXACTES À SUIVRE

### 1️⃣ Dans le menu de gauche, cliquez sur **"Database"** (avec l'icône 🗄️)

**PAS** "Settings" → "Database"  
**MAIS** directement "Database" dans le menu principal

```
Menu de gauche :
┌─────────────────────┐
│ 🏠 Home             │
│ 📊 Table Editor     │
│ 🔧 SQL Editor       │
│ 🗄️  Database        │ ← CLIQUEZ ICI (pas dans Settings!)
│ 🔐 Authentication   │
│ 📦 Storage          │
└─────────────────────┘
```

### 2️⃣ Une fois sur la page "Database", cherchez en haut les onglets

Vous devriez voir quelque chose comme :
```
[Tables] [Roles] [Extensions] [Replication] [Connection]
                                              ↑↑↑↑↑↑↑↑↑↑
                                          CLIQUEZ ICI
```

OU peut-être un bouton **"Connect"** en haut à droite

### 3️⃣ Cliquez sur "Connection" ou "Connect"

### 4️⃣ Vous verrez alors plusieurs sections :

**a) Connection String** ou **Connection Pooling**
   - Mode: `Transaction` | `Session` | `Direct`
   - **Sélectionnez "Session"**

**b) En dessous, vous verrez des onglets :**
   ```
   [PSQL] [URI] [.env]
          ↑↑↑
      CLIQUEZ ICI
   ```

**c) Vous verrez l'URL complète !**

---

## 🚀 ALTERNATIVE : Via l'API

Si vous ne trouvez vraiment pas, vous pouvez construire l'URL manuellement.

### Depuis votre page actuelle (Settings → Database) :

**Scrollez vers le haut** et cherchez une section qui affiche :
- **Host**
- **Port**  
- **Database name**
- **User**

### Ou utilisez ces informations de votre projet :

Votre **Project Reference** : `bklfpburxuluzxrtqyoa` (visible dans l'URL)

**Format de l'URL** :
```
postgresql://postgres.bklfpburxuluzxrtqyoa:[VOTRE_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**⚠️ Vous devez remplacer `[VOTRE_PASSWORD]`** par le mot de passe que vous avez créé lors de la création du projet.

---

## 🔐 Si vous ne vous souvenez pas du mot de passe

Sur votre page actuelle (Database Settings), cliquez sur :

**"Reset database password"** (en haut, section "Database password")

1. Cliquez sur le bouton
2. Supabase va générer un nouveau mot de passe
3. **COPIEZ-LE IMMÉDIATEMENT** (vous ne pourrez plus le voir après)
4. Utilisez ce nouveau mot de passe dans la DATABASE_URL

---

## 📋 RÉCAPITULATIF : Ce que vous cherchez

Une URL qui ressemble à ça :

```
postgresql://postgres.bklfpburxuluzxrtqyoa:VotreMotDePasse@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

Composants :
- `postgres.bklfpburxuluzxrtqyoa` = Votre user
- `VotreMotDePasse` = Votre password (à remplacer)
- `aws-0-eu-central-1.pooler.supabase.com` = Host
- `6543` = Port (pooler)
- `postgres` = Database name

---

## ✅ Une fois que vous avez l'URL

```bash
# Créez le fichier .env.local
echo 'DATABASE_URL="postgresql://postgres.bklfpburxuluzxrtqyoa:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"' > .env.local

# Remplacez PASSWORD par votre vrai mot de passe !
```

---

## 🆘 Si ça ne marche toujours pas

Envoyez-moi une capture d'écran :
1. De la page "Database" (menu principal, pas Settings)
2. Ou du résultat après avoir cliqué sur "Connect"

Je pourrai vous guider plus précisément ! 🚀

