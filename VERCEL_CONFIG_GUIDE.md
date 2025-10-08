# 🚨 PROBLÈME IDENTIFIÉ : Variables d'Environnement Manquantes sur Vercel

## 🔍 Diagnostic des Erreurs Console

Les erreurs dans la console de votre navigateur montrent clairement que :

❌ **`Missing value for Stripe(): apiKey should be a string`**
- La variable `STRIPE_PUBLISHABLE_KEY` n'est **pas configurée sur Vercel**

❌ **`GET /api/keys 500`** et **`GET /api/usage 500`**
- La variable `DATABASE_URL` n'est **pas configurée sur Vercel**
- L'application ne peut pas se connecter à la base de données

❌ **`TypeError: Cannot read properties of undefined (reading 'credits')`**
- Conséquence directe : les API ne retournent pas de données

---

## ✅ SOLUTION : Configurer les Variables d'Environnement

### Étape 1 : Allez sur Vercel

1. Ouvrez : **https://vercel.com**
2. Connectez-vous si nécessaire
3. Cliquez sur votre projet **"fetchify"** (ou le nom que vous lui avez donné)

### Étape 2 : Accédez aux Variables d'Environnement

1. Cliquez sur l'onglet **"Settings"** en haut
2. Dans le menu de gauche, cliquez sur **"Environment Variables"**

### Étape 3 : Ajoutez les Variables (UNE PAR UNE)

Pour chaque variable ci-dessous, cliquez sur **"Add New"** et remplissez :

#### Variable 1 : DATABASE_URL

```
Nom : DATABASE_URL
Valeur : postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
Environnement : Production, Preview, Development (cochez les 3)
```

#### Variable 2 : NEXTAUTH_URL

```
Nom : NEXTAUTH_URL
Valeur : https://fetchify-nine.vercel.app
Environnement : Production, Preview, Development (cochez les 3)
```

⚠️ **IMPORTANT** : Changez `fetchify-nine.vercel.app` par votre vrai domaine si différent !

#### Variable 3 : NEXTAUTH_SECRET

```
Nom : NEXTAUTH_SECRET
Valeur : htuYCqpYiJyi1JIpBASWxajsai+yO9k5+7raCucIlpE=
Environnement : Production, Preview, Development (cochez les 3)
```

#### Variable 4 : STRIPE_SECRET_KEY

```
Nom : STRIPE_SECRET_KEY
Valeur : sk_test_... (ou sk_live_... si en mode live)
Environnement : Production, Preview, Development (cochez les 3)
```

⚠️ Vous devez récupérer cette clé depuis Stripe → Developers → API Keys

#### Variable 5 : STRIPE_PUBLISHABLE_KEY

```
Nom : STRIPE_PUBLISHABLE_KEY
Valeur : pk_test_... (ou pk_live_... si en mode live)
Environnement : Production, Preview, Development (cochez les 3)
```

⚠️ Vous devez récupérer cette clé depuis Stripe → Developers → API Keys

#### Variable 6 : STRIPE_WEBHOOK_SECRET

```
Nom : STRIPE_WEBHOOK_SECRET
Valeur : whsec_... (vous devrez créer un webhook sur Stripe)
Environnement : Production, Preview, Development (cochez les 3)
```

⚠️ Pour l'instant, mettez `whsec_temp` (nous configurerons le vrai webhook après)

#### Variable 7 : EXTERNAL_API_URL

```
Nom : EXTERNAL_API_URL
Valeur : https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9
Environnement : Production, Preview, Development (cochez les 3)
```

#### Variable 8 : NODE_ENV

```
Nom : NODE_ENV
Valeur : production
Environnement : Production seulement
```

---

### Étape 4 : Redéployez l'Application

Une fois TOUTES les variables ajoutées :

1. Allez dans l'onglet **"Deployments"** en haut
2. Trouvez le dernier déploiement (celui qui a échoué)
3. Cliquez sur les **3 petits points** (...)
4. Cliquez sur **"Redeploy"**
5. Confirmez

---

## 🎯 Vérification

Après le redéploiement (1-2 minutes) :

1. Ouvrez votre site : `https://fetchify-nine.vercel.app`
2. Créez un compte ou connectez-vous
3. Vous devriez voir le dashboard **SANS ERREURS** !

---

## 🆘 Si ça ne marche toujours pas

Envoyez-moi :
1. Une capture d'écran de la page "Environment Variables" sur Vercel
2. Les nouvelles erreurs de la console (F12)

