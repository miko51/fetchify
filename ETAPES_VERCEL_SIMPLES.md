# 🚀 Configuration Vercel - Guide Ultra-Simplifié

## ❌ Problème Actuel

Vous essayez de créer un compte sur `fetchify-nine.vercel.app` mais vous avez l'erreur :
```
Erreur lors de la création du compte
```

**Cause** : Les variables d'environnement ne sont pas configurées sur Vercel.

---

## ✅ Solution en 5 Étapes

### Étape 1 : Récupérez vos clés Stripe (5 min)

1. Allez sur : **https://dashboard.stripe.com/test/apikeys**
2. Vous verrez deux clés :
   - **Secret key** (commence par `sk_test_...`) → Cliquez sur "Reveal test key" et **copiez-la**
   - **Publishable key** (commence par `pk_test_...`) → **Copiez-la**
3. Gardez ces deux clés dans un fichier texte temporaire

---

### Étape 2 : Allez sur Vercel

1. Ouvrez : **https://vercel.com**
2. Connectez-vous
3. Cliquez sur votre projet (probablement nommé "fetchify" ou "api-products-crawl")

---

### Étape 3 : Ouvrez les Variables d'Environnement

1. En haut de la page, cliquez sur l'onglet **"Settings"**
2. Dans le menu de gauche, cliquez sur **"Environment Variables"**
3. Vous verrez une page avec un bouton **"Add New"**

---

### Étape 4 : Ajoutez les 8 Variables (UNE PAR UNE)

Pour chaque variable :
1. Cliquez sur **"Add New"**
2. Remplissez "Key" et "Value"
3. **Cochez les 3 cases** : Production, Preview, Development
4. Cliquez sur **"Save"**

#### Variable 1
```
Key:   DATABASE_URL
Value: postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
```

#### Variable 2
```
Key:   NEXTAUTH_URL
Value: https://fetchify-nine.vercel.app
```

#### Variable 3
```
Key:   NEXTAUTH_SECRET
Value: htuYCqpYiJyi1JIpBASWxajsai+yO9k5+7raCucIlpE=
```

#### Variable 4
```
Key:   STRIPE_SECRET_KEY
Value: [COLLEZ ICI VOTRE sk_test_... de l'Étape 1]
```

#### Variable 5
```
Key:   STRIPE_PUBLISHABLE_KEY
Value: [COLLEZ ICI VOTRE pk_test_... de l'Étape 1]
```

#### Variable 6
```
Key:   STRIPE_WEBHOOK_SECRET
Value: whsec_temp
```

#### Variable 7
```
Key:   EXTERNAL_API_URL
Value: https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9
```

#### Variable 8
```
Key:   NODE_ENV
Value: production
```
⚠️ **Pour celle-ci UNIQUEMENT** : Ne cochez QUE "Production" (décochez Preview et Development)

---

### Étape 5 : Redéployez l'Application

1. En haut de la page, cliquez sur l'onglet **"Deployments"**
2. Vous verrez la liste des déploiements
3. Sur le premier (le plus récent), cliquez sur les **3 petits points** (...) à droite
4. Cliquez sur **"Redeploy"**
5. Confirmez en cliquant sur **"Redeploy"** dans la popup
6. **Attendez 1-2 minutes** que le build se termine

---

## 🎉 Test Final

1. Allez sur : `https://fetchify-nine.vercel.app`
2. Cliquez sur "Inscription"
3. Créez un compte
4. **Ça devrait fonctionner !** ✅

---

## 🆘 Aide

Si vous avez un problème à une étape, dites-moi laquelle et envoyez une capture d'écran !

