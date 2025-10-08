# 🔐 Variables d'Environnement pour Vercel

Liste complète des variables à configurer dans Vercel → Settings → Environment Variables

---

## 📋 Variables à Créer

### 1. Base de Données (Supabase)

**Variable** : `DATABASE_URL`

**Valeur** :
```
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANT** : 
- Utilisez le **POOLER** (port 6543), pas la connexion directe (port 5432)
- C'est l'URL que vous avez récupérée de Supabase → Database → Connection → Transaction

---

### 2. NextAuth

**Variable** : `NEXTAUTH_URL`

**Valeur** :
```
https://fetchify.app
```

**⚠️ Note** : Changez cette URL si vous utilisez un autre domaine

---

**Variable** : `NEXTAUTH_SECRET`

**Valeur** :
```
htuYCqpYiJyi1JIpBASWxajsai+yO9k5+7raCucIlpE=
```

---

### 3. Stripe (MODE LIVE)

**⚠️ ATTENTION** : Vous devez d'abord passer Stripe en mode LIVE !

**Variable** : `STRIPE_SECRET_KEY`

**Valeur** :
```
sk_live_VOTRE_CLE_SECRETE_LIVE
```

**Comment obtenir** :
1. https://dashboard.stripe.com
2. Décochez "Test mode" (en haut à droite)
3. Settings → Developers → API keys
4. Copiez la "Secret key" (commence par `sk_live_...`)

---

**Variable** : `STRIPE_PUBLISHABLE_KEY`

**Valeur** :
```
pk_live_VOTRE_CLE_PUBLIQUE_LIVE
```

**Comment obtenir** :
- Même endroit que ci-dessus
- Copiez la "Publishable key" (commence par `pk_live_...`)

---

**Variable** : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Valeur** :
```
pk_live_VOTRE_CLE_PUBLIQUE_LIVE
```

**⚠️ Note** : C'est la même valeur que `STRIPE_PUBLISHABLE_KEY`

---

**Variable** : `STRIPE_WEBHOOK_SECRET`

**Valeur** :
```
whsec_VOTRE_WEBHOOK_SECRET
```

**Comment obtenir** :
1. Stripe Dashboard (mode LIVE)
2. Developers → Webhooks
3. Add endpoint : `https://fetchify.app/api/stripe/webhook`
4. Événements : `checkout.session.completed`
5. Copiez le "Signing secret" (commence par `whsec_...`)

**⚠️ IMPORTANT** : Créez le webhook APRÈS avoir déployé sur Vercel !

---

### 4. API Externe

**Variable** : `EXTERNAL_API_URL`

**Valeur** :
```
https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9
```

---

## 📝 Résumé : Toutes les Variables

Voici le résumé pour copier-coller dans Vercel :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `DATABASE_URL` | `postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://fetchify.app` | Production |
| `NEXTAUTH_SECRET` | `htuYCqpYiJyi1JIpBASWxajsai+yO9k5+7raCucIlpE=` | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | `sk_live_...` (À récupérer) | Production |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (À récupérer) | Production, Preview, Development |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (Même que ci-dessus) | Production, Preview, Development |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (À créer après déploiement) | Production |
| `EXTERNAL_API_URL` | `https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9` | Production, Preview, Development |

---

## ✅ Checklist pour Chaque Variable

Pour chaque variable dans Vercel :

1. **Name** : Le nom de la variable (ex: `DATABASE_URL`)
2. **Value** : La valeur correspondante
3. **Environments** : Cochez les cases appropriées :
   - ✅ **Production** (toujours)
   - ✅ **Preview** (recommandé pour tester)
   - ✅ **Development** (recommandé)

---

## 🚨 Variables à NE PAS Utiliser (Mode Test)

**NE METTEZ PAS** vos clés de TEST en production !

**Utilisez uniquement les clés LIVE (sk_live_... et pk_live_...)** pour la production !

---

## 🎯 Ordre de Configuration Recommandé

### 1. D'abord : Passer Stripe en Mode LIVE

1. https://dashboard.stripe.com
2. Décochez "Test mode"
3. Settings → Developers → API keys
4. Copiez les clés LIVE

### 2. Ensuite : Créer les Variables sur Vercel

1. https://vercel.com
2. Votre projet → Settings → Environment Variables
3. Ajoutez toutes les variables sauf `STRIPE_WEBHOOK_SECRET`
4. Déployez !

### 3. Après le Déploiement : Configurer le Webhook

1. Attendez que le déploiement soit terminé
2. Stripe → Developers → Webhooks
3. Add endpoint : `https://fetchify.app/api/stripe/webhook`
4. Copiez le "Signing secret"
5. Retournez sur Vercel → Settings → Environment Variables
6. Ajoutez `STRIPE_WEBHOOK_SECRET` avec le secret
7. Redéployez (Deployments → ... → Redeploy)

---

## 🔐 Sécurité

**Ne commitez JAMAIS** ces variables sur GitHub !

Elles sont déjà dans `.gitignore` :
```
.env
.env*.local
.env.backup
```

**Les variables d'environnement doivent UNIQUEMENT être** :
- Dans votre `.env` local (pour développement)
- Dans Vercel (pour production)
- **JAMAIS sur GitHub !**

---

## 💡 Astuce : Variables pour Preview/Development

Pour les environnements **Preview** et **Development** sur Vercel :

- `NEXTAUTH_URL` : Laissez Vercel gérer automatiquement (ne définissez que pour Production)
- Autres variables : Mêmes valeurs que Production (ou utilisez des clés de test si vous préférez)

---

## 🆘 Problèmes Courants

### "DATABASE_URL" is missing

**Cause** : Vous avez oublié d'ajouter la variable ou le déploiement n'a pas pris en compte les nouvelles variables

**Solution** : 
1. Vérifiez dans Settings → Environment Variables
2. Redéployez l'application

### Stripe errors en production

**Cause** : Vous utilisez les clés de TEST au lieu des clés LIVE

**Solution** :
1. Passez en mode LIVE sur Stripe
2. Remplacez les clés dans Vercel
3. Redéployez

### Webhooks ne fonctionnent pas

**Cause** : Le `STRIPE_WEBHOOK_SECRET` n'est pas configuré ou est incorrect

**Solution** :
1. Vérifiez l'URL du webhook : `https://fetchify.app/api/stripe/webhook`
2. Vérifiez le secret dans Vercel
3. Testez le webhook dans Stripe Dashboard → Webhooks → Send test webhook

---

## ✅ Validation Finale

Avant de déployer, vérifiez que :

- [ ] ✅ Vous avez bien l'URL du **POOLER** (port 6543, pas 5432)
- [ ] ✅ Stripe est en mode **LIVE** (pas Test)
- [ ] ✅ Vous avez les clés **sk_live_** et **pk_live_**
- [ ] ✅ `NEXTAUTH_URL` pointe vers **https://fetchify.app**
- [ ] ✅ Toutes les variables sont cochées **Production**
- [ ] ✅ `.env` et `.env.local` sont dans `.gitignore`

---

**Une fois toutes les variables configurées, cliquez sur "Deploy" ! 🚀**

