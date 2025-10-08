# 🔧 Correction de l'URL Supabase

## 🔍 Problème Détecté

L'erreur `FATAL: Tenant or user not found` signifie que Vercel ne peut pas se connecter à Supabase.

---

## ✅ Solution : Utiliser la Connexion Directe

### Étape 1 : Récupérer la BONNE URL

1. Allez sur : **https://supabase.com/dashboard**
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Database**
4. Cherchez la section **"Connection String"**
5. Sélectionnez l'onglet **"URI"** (pas Transaction, ni Session)
6. Copiez l'URL qui ressemble à :

```
postgresql://postgres:[YOUR-PASSWORD]@db.bklfpburxuluzkrtqyoa.supabase.co:5432/postgres
```

⚠️ **ATTENTION** : Remplacez `[YOUR-PASSWORD]` par votre vrai mot de passe !

---

### Étape 2 : Mettre à Jour la Variable sur Vercel

1. Allez sur **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. Trouvez la variable **`DATABASE_URL`**
3. Cliquez sur les **3 points** (...) → **Edit**
4. Remplacez par la nouvelle URL (avec port **5432**)
5. Cliquez sur **Save**

---

### Étape 3 : Redéployer

1. Allez dans **Deployments**
2. Cliquez sur **...** → **Redeploy**
3. Attendez 1-2 minutes

---

## 📊 Étape 4 : Créer les Tables dans Supabase

Avant que ça marche, il faut aussi **créer les tables** dans Supabase !

### Option A : Via l'Interface Supabase (recommandé)

1. Sur Supabase, allez dans **SQL Editor**
2. Cliquez sur **"New query"**
3. Je vais vous donner le SQL à exécuter...

---

## 🎯 Résumé

**Problème** : URL pooler mal configurée + tables peut-être manquantes

**Solution** :
1. ✅ Utiliser la connexion directe (port 5432)
2. ✅ Vérifier que les tables existent
3. ✅ Redéployer

---

**ATTENDEZ, je vais vous donner l'URL exacte à utiliser !**

