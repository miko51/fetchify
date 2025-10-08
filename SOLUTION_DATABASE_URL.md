# 🔧 SOLUTION : Corriger la connexion à Supabase

## ❌ Le problème

L'erreur `FATAL: Tenant or user not found` signifie que la connexion à Supabase échoue.

---

## ✅ LA SOLUTION (2 options)

### **Option 1 : URL Pooler (RECOMMANDÉ pour Vercel)**

Utilisez cette URL **EXACTE** pour Vercel et localement :

```
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Notez le `?pgbouncer=true` à la fin !**

---

### **Option 2 : URL Directe avec SSL (pour local)**

Si l'option 1 ne fonctionne pas localement, utilisez :

```
postgresql://postgres:pjEpd5OClWhhngDL@db.bklfpburxuluzkrtqyoa.supabase.co:5432/postgres?sslmode=require
```

**Notez le `?sslmode=require` à la fin !**

---

## 📝 ÉTAPES À SUIVRE

### 1️⃣ Modifier `.env.local` (LOCAL)

```bash
DATABASE_URL="postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 2️⃣ Modifier sur Vercel

1. Allez sur https://vercel.com
2. Ouvrez votre projet **fetchify**
3. Cliquez sur **Settings** → **Environment Variables**
4. Trouvez `DATABASE_URL`
5. Cliquez sur **Edit**
6. Remplacez par :
   ```
   postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
7. Cliquez sur **Save**

### 3️⃣ Redéployer

Sur Vercel, cliquez sur **Deployments** → **Redeploy** (bouton avec les 3 points `...`)

---

## 🧪 Tester localement

Une fois `.env.local` modifié :

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer :
PORT=3005 npm run dev
```

Puis testez l'inscription sur http://localhost:3005

---

## 🆘 Si ça ne marche toujours pas

Vérifiez sur Supabase que :
1. Le projet est bien actif
2. La base de données est bien démarrée
3. Le mot de passe n'a pas changé

Allez sur https://supabase.com/dashboard/project/bklfpburxuluzkrtqyoa/settings/database et vérifiez la **Connection string** (URI).

