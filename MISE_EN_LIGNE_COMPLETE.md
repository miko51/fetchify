# 🚀 Guide Complet : Mise en Ligne de Fetchify

Guide complet pour déployer votre application sur Vercel avec votre domaine `fetchify.app` acheté sur OVH.

---

## 📋 Checklist Avant de Commencer

Avant de déployer, assurez-vous d'avoir :

- [x] ✅ Application qui fonctionne en local sur http://localhost:3005
- [x] ✅ Base de données Supabase configurée avec les tables créées
- [x] ✅ Domaine `fetchify.app` acheté sur OVH
- [ ] 🔄 Code poussé sur GitHub
- [ ] 🔄 URL du pooler Supabase (port 6543) récupérée
- [ ] 🔄 Clés Stripe en mode LIVE (actuellement vous êtes en test)
- [ ] 🔄 Compte Vercel créé

---

## 🎯 ÉTAPE 1 : Préparer le Code pour la Production

### 1.1 - Pousser le code sur GitHub

Si ce n'est pas déjà fait :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit - Fetchify app ready for production"

# Créer un repo sur GitHub et le lier
git remote add origin https://github.com/VOTRE_USERNAME/fetchify.git
git branch -M main
git push -u origin main
```

**⚠️ Important** : Vérifiez que `.env` et `.env.local` sont bien dans `.gitignore` !

```bash
# Vérifier le .gitignore
cat .gitignore | grep ".env"
```

Vous devriez voir :
```
.env*.local
.env
```

---

## 🎯 ÉTAPE 2 : Récupérer l'URL du Pooler Supabase

**CRITIQUE pour Vercel** : Vous devez utiliser le pooler (port 6543) au lieu de la connexion directe (port 5432).

### Comment obtenir l'URL du Pooler :

1. **Allez sur Supabase** : https://app.supabase.com/project/bklfpburxuluzkrtqyoa

2. **Cliquez sur "Database"** dans le menu de gauche (pas Settings!)

3. **Cliquez sur "Connection"** en haut

4. **Sélectionnez le mode "Transaction"** (recommandé pour Vercel)

5. **Cliquez sur l'onglet "URI"**

6. **Copiez l'URL complète** qui devrait ressembler à :
```
postgresql://postgres.bklfpburxuluzkrtqyoa:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**⚠️ Points de vérification** :
- ✅ L'URL contient `pooler.supabase.com` (pas juste `supabase.co`)
- ✅ Le port est `6543` (pas `5432`)
- ✅ Votre mot de passe est présent (pas `[YOUR-PASSWORD]`)

**Note** : Si vous ne voyez pas votre mot de passe, remplacez `[PASSWORD]` par : `pjEpd5OClWhhngDL`

---

## 🎯 ÉTAPE 3 : Créer un Compte Vercel et Déployer

### 3.1 - Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"**
3. **Connectez-vous avec GitHub** (recommandé)
4. Autorisez Vercel à accéder à vos repos GitHub

### 3.2 - Importer votre projet

1. Dans le dashboard Vercel, cliquez sur **"New Project"**
2. Sélectionnez votre repo **`fetchify`** depuis GitHub
3. Vercel détectera automatiquement Next.js
4. **NE CLIQUEZ PAS ENCORE SUR "DEPLOY" !**

### 3.3 - Configurer les Variables d'Environnement

**AVANT de déployer**, ajoutez toutes les variables d'environnement :

Cliquez sur **"Environment Variables"** et ajoutez :

#### 🗄️ Base de données (Supabase)

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-0-[REGION].pooler.supabase.com:6543/postgres` |

**⚠️ Remplacez `[REGION]` par la vraie région** que vous avez copiée depuis Supabase !

**⚠️ Important** : Utilisez l'URL du pooler (port 6543), pas celle que vous utilisez en local (port 5432) !

#### 🔐 NextAuth

| Name | Value |
|------|-------|
| `NEXTAUTH_URL` | `https://fetchify.app` |
| `NEXTAUTH_SECRET` | `htuYCqpYiJyi1JIpBASWxajsai+yO9k5+7raCucIlpE=` |

#### 💳 Stripe (IMPORTANT : Mode LIVE)

**⚠️ ATTENTION** : Vous devez passer en mode LIVE pour la production !

1. **Allez sur Stripe Dashboard** : https://dashboard.stripe.com
2. **Basculez en mode "Live"** (en haut à droite, décochez "Test mode")
3. **Récupérez vos clés LIVE** :
   - Settings → Developers → API keys
   - Copiez la "Secret key" (commence par `sk_live_...`)
   - Copiez la "Publishable key" (commence par `pk_live_...`)

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_VOTRE_CLE_SECRETE_LIVE` |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_VOTRE_CLE_PUBLIQUE_LIVE` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_VOTRE_CLE_PUBLIQUE_LIVE` |

**Note** : Le webhook secret sera configuré plus tard (étape 5)

#### 🔗 API Externe

| Name | Value |
|------|-------|
| `EXTERNAL_API_URL` | `https://n8n.wharfer.io/webhook/3a53069f-ca20-4c01-afc9-5e98639b5da9` |

#### ✅ Configuration pour toutes les variables

Pour **chaque variable**, cochez les 3 environnements :
- ✅ Production
- ✅ Preview
- ✅ Development

### 3.4 - Déployer !

1. Une fois toutes les variables ajoutées, cliquez sur **"Deploy"**
2. Attendez que le build se termine (2-3 minutes)
3. **Votre app est en ligne !** 🎉

Vercel vous donnera une URL temporaire comme :
```
https://fetchify-xxx.vercel.app
```

**Testez-la** avant de configurer votre domaine personnalisé !

---

## 🎯 ÉTAPE 4 : Configurer le Domaine Personnalisé sur Vercel

### 4.1 - Ajouter le domaine sur Vercel

1. Dans votre projet Vercel, allez dans **"Settings"** → **"Domains"**
2. Cliquez sur **"Add"**
3. Entrez : `fetchify.app`
4. Cliquez sur **"Add"**
5. Vercel vous donnera des instructions DNS

### 4.2 - Ajouter aussi le sous-domaine www

Répétez l'opération pour :
- `www.fetchify.app`

Vercel configurera automatiquement une redirection de `www` vers le domaine principal.

---

## 🎯 ÉTAPE 5 : Configurer les DNS sur OVH

Maintenant, configurez OVH pour pointer vers Vercel.

### 5.1 - Se connecter à OVH

1. Allez sur https://www.ovh.com/manager/
2. Connectez-vous
3. Cliquez sur votre domaine **`fetchify.app`**
4. Allez dans **"Zone DNS"**

### 5.2 - Configurer les enregistrements DNS

Vous devez ajouter/modifier ces enregistrements :

#### Pour le domaine principal (`fetchify.app`)

**Type A :**
| Type | Nom | Cible | TTL |
|------|-----|-------|-----|
| A | @ | `76.76.21.21` | 300 |

**OU Type CNAME (selon les instructions de Vercel) :**
| Type | Nom | Cible | TTL |
|------|-----|-------|-----|
| CNAME | @ | `cname.vercel-dns.com.` | 300 |

**⚠️ Important** : Vercel vous indiquera exactement quel type utiliser dans Settings → Domains.

#### Pour le sous-domaine www

| Type | Nom | Cible | TTL |
|------|-----|-------|-----|
| CNAME | www | `cname.vercel-dns.com.` | 300 |

### 5.3 - Sauvegarder et attendre

1. **Sauvegardez** les modifications dans OVH
2. **Attendez 5-30 minutes** pour la propagation DNS
3. **Vérifiez** sur Vercel : le statut passera de "Pending" à "Valid"

### 5.4 - Vérifier la propagation DNS

Vous pouvez vérifier avec cette commande :

```bash
# Vérifier le domaine principal
nslookup fetchify.app

# Vérifier le sous-domaine
nslookup www.fetchify.app
```

Ou utilisez un outil en ligne :
- https://dnschecker.org/#A/fetchify.app

---

## 🎯 ÉTAPE 6 : Configurer les Webhooks Stripe

**CRITIQUE** : Stripe doit pouvoir notifier votre app lors des paiements.

### 6.1 - Créer le webhook sur Stripe

1. Allez sur **Stripe Dashboard** : https://dashboard.stripe.com
2. **Basculez en mode "Live"** (en haut à droite)
3. Allez dans **Developers** → **Webhooks**
4. Cliquez sur **"Add endpoint"**

### 6.2 - Configurer le webhook

**URL du endpoint** :
```
https://fetchify.app/api/stripe/webhook
```

**Événements à écouter** :
- ✅ `checkout.session.completed`
- ✅ `charge.succeeded` (optionnel mais recommandé)

Cliquez sur **"Add endpoint"**

### 6.3 - Récupérer le Signing Secret

1. Cliquez sur le webhook que vous venez de créer
2. Dans la section **"Signing secret"**, cliquez sur **"Reveal"**
3. Copiez le secret (commence par `whsec_...`)

### 6.4 - Ajouter le secret dans Vercel

1. Retournez sur **Vercel** → votre projet → **Settings** → **Environment Variables**
2. Cliquez sur **"Add New"**
3. Ajoutez :

| Name | Value |
|------|-------|
| `STRIPE_WEBHOOK_SECRET` | `whsec_VOTRE_SECRET_WEBHOOK_LIVE` |

4. Cochez **"Production"** uniquement (pas Preview ni Development)
5. Cliquez sur **"Save"**

### 6.5 - Redéployer

**Important** : Après avoir ajouté une variable d'environnement, vous devez redéployer :

1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les 3 points à côté du dernier déploiement
3. Cliquez sur **"Redeploy"**
4. Confirmez

---

## 🎯 ÉTAPE 7 : Créer les Produits Stripe en Mode LIVE

**Vos packs de crédits actuels sont en mode TEST**. Vous devez les recréer en mode LIVE.

### 7.1 - Créer les produits sur Stripe

1. **Stripe Dashboard** → Mode **"Live"** activé
2. Allez dans **Products** → **"Add product"**

Créez ces 3 produits :

#### Pack Starter
- **Name** : Pack Starter - 100 crédits
- **Description** : 100 crédits pour utiliser l'API Fetchify
- **Price** : €9.99 (one-time payment)
- Cliquez sur **"Save product"**
- **Copiez le Price ID** (commence par `price_...`)

#### Pack Pro
- **Name** : Pack Pro - 500 crédits
- **Description** : 500 crédits pour utiliser l'API Fetchify
- **Price** : €39.99 (one-time payment)
- Cliquez sur **"Save product"**
- **Copiez le Price ID**

#### Pack Enterprise
- **Name** : Pack Enterprise - 2000 crédits
- **Description** : 2000 crédits pour utiliser l'API Fetchify
- **Price** : €129.99 (one-time payment)
- Cliquez sur **"Save product"**
- **Copiez le Price ID**

### 7.2 - Mettre à jour les Price IDs dans Supabase

1. Allez sur **Supabase** → **Table Editor** → **credit_packages**
2. Cliquez sur chaque package et mettez à jour le champ `stripePriceId` avec les nouveaux Price IDs LIVE

**Ou via SQL Editor** :

```sql
-- Mettre à jour le pack Starter
UPDATE credit_packages 
SET "stripePriceId" = 'price_VOTRE_PRICE_ID_STARTER_LIVE' 
WHERE credits = 100;

-- Mettre à jour le pack Pro
UPDATE credit_packages 
SET "stripePriceId" = 'price_VOTRE_PRICE_ID_PRO_LIVE' 
WHERE credits = 500;

-- Mettre à jour le pack Enterprise
UPDATE credit_packages 
SET "stripePriceId" = 'price_VOTRE_PRICE_ID_ENTERPRISE_LIVE' 
WHERE credits = 2000;
```

---

## 🎯 ÉTAPE 8 : Configurer le Portail Client Stripe

Pour que vos clients puissent gérer leurs factures :

1. **Stripe Dashboard** → **Settings** → **Billing** → **Customer portal**
2. Cliquez sur **"Activate"**
3. Configurez les options selon vos préférences
4. Dans **"Business information"**, ajoutez :
   - Nom : Fetchify
   - Email de support : support@fetchify.app (ou votre email)
5. Cliquez sur **"Save changes"**

---

## 🎯 ÉTAPE 9 : Tests Finaux en Production

### 9.1 - Tester l'inscription

1. Allez sur https://fetchify.app
2. Créez un compte avec un vrai email (pas de test)
3. Vérifiez que vous recevez bien l'email de confirmation (si configuré)

### 9.2 - Tester l'achat de crédits

**⚠️ ATTENTION** : Vous êtes en mode LIVE, les paiements sont réels !

**Option A : Test avec une vraie carte**
- Achetez un petit pack pour tester
- Vérifiez que les crédits sont ajoutés

**Option B : Stripe Test Cards en mode Live**
- Vous ne pouvez PAS utiliser `4242 4242 4242 4242` en mode Live
- Vous devez tester avec une vraie carte ou créer un coupon à 100%

**Pour créer un coupon de test à 100% :**
1. Stripe Dashboard → **Products** → **Coupons**
2. Créez un coupon "TEST100" avec 100% de réduction
3. Utilisez-le lors de votre achat de test

### 9.3 - Tester l'API

1. Créez une API key
2. Testez l'API avec curl :

```bash
curl -X POST "https://fetchify.app/api/v1/product-crawl?url=https://www.amazon.com/dp/B08N5WRWNW" \
  -H "X-API-Key: VOTRE_CLE_API"
```

3. Vérifiez que :
   - ✅ L'API répond correctement
   - ✅ Vos crédits sont déduits
   - ✅ L'usage est enregistré dans le dashboard

### 9.4 - Tester le webhook Stripe

1. Faites un vrai achat (ou avec le coupon 100%)
2. Vérifiez dans **Stripe Dashboard** → **Webhooks** :
   - Le webhook doit montrer un statut **"Succeeded"**
3. Vérifiez dans votre dashboard que les crédits sont ajoutés

---

## 🎯 ÉTAPE 10 : Configuration Finale NextAuth URL

**Important** : Mettez à jour `NEXTAUTH_URL` dans Vercel si ce n'est pas déjà fait :

1. Vercel → Settings → Environment Variables
2. Cherchez `NEXTAUTH_URL`
3. Vérifiez qu'il est bien à : `https://fetchify.app`
4. Si vous devez le modifier, **redéployez** après

---

## 🎯 ÉTAPE 11 : Activer le SSL et HTTPS

Vercel active automatiquement le SSL (HTTPS) pour votre domaine.

**Vérifications** :
- ✅ Votre site est accessible en HTTPS : https://fetchify.app
- ✅ Le certificat SSL est valide (cadenas vert dans le navigateur)
- ✅ Les requêtes HTTP sont automatiquement redirigées vers HTTPS

Si ce n'est pas le cas :
1. Attendez quelques minutes supplémentaires
2. Vérifiez dans Vercel → Settings → Domains que le certificat est bien émis

---

## ✅ Checklist Finale de Déploiement

### Infrastructure
- [ ] ✅ Code poussé sur GitHub
- [ ] ✅ Déployé sur Vercel
- [ ] ✅ Domaine `fetchify.app` configuré
- [ ] ✅ DNS OVH configurés et propagés
- [ ] ✅ SSL/HTTPS activé

### Base de Données
- [ ] ✅ URL du pooler Supabase (port 6543) configurée sur Vercel
- [ ] ✅ Tables créées dans Supabase
- [ ] ✅ Credit packages seedés

### Stripe
- [ ] ✅ Passé en mode LIVE
- [ ] ✅ Clés LIVE ajoutées dans Vercel
- [ ] ✅ Produits créés en mode LIVE
- [ ] ✅ Price IDs mis à jour dans Supabase
- [ ] ✅ Webhook configuré vers https://fetchify.app/api/stripe/webhook
- [ ] ✅ Webhook secret ajouté dans Vercel
- [ ] ✅ Portail client activé

### Tests
- [ ] ✅ Inscription fonctionne
- [ ] ✅ Connexion fonctionne
- [ ] ✅ Création d'API key fonctionne
- [ ] ✅ Achat de crédits fonctionne (webhook OK)
- [ ] ✅ API répond correctement
- [ ] ✅ Crédits sont déduits après utilisation de l'API

---

## 🚨 Problèmes Courants et Solutions

### Problème 1 : "Too many connections" en production

**Cause** : Vous n'utilisez pas l'URL du pooler (port 6543)

**Solution** : Vérifiez que `DATABASE_URL` dans Vercel utilise bien le port 6543 et contient `pooler.supabase.com`

### Problème 2 : Les webhooks Stripe ne fonctionnent pas

**Symptômes** : Les crédits ne sont pas ajoutés après un achat

**Solutions** :
1. Vérifiez que l'URL du webhook est `https://fetchify.app/api/stripe/webhook` (pas de `/` à la fin)
2. Vérifiez que le webhook secret (`STRIPE_WEBHOOK_SECRET`) est bien dans Vercel
3. Vérifiez les logs du webhook dans Stripe Dashboard → Webhooks
4. Redéployez après avoir ajouté la variable

### Problème 3 : Domaine inaccessible

**Solutions** :
1. Vérifiez la propagation DNS : https://dnschecker.org
2. Attendez jusqu'à 24h (mais généralement < 1h)
3. Videz le cache DNS de votre navigateur
4. Essayez en navigation privée

### Problème 4 : Erreurs 500 en production

**Solutions** :
1. Vérifiez les logs dans Vercel → Deployments → View Function Logs
2. Vérifiez que toutes les variables d'environnement sont présentes
3. Vérifiez que `DATABASE_URL` est correct
4. Vérifiez que les tables existent dans Supabase

### Problème 5 : NextAuth ne fonctionne pas

**Solutions** :
1. Vérifiez que `NEXTAUTH_URL` est `https://fetchify.app` (pas de `/` à la fin)
2. Vérifiez que `NEXTAUTH_SECRET` est présent
3. Redéployez après toute modification

---

## 📊 Monitoring et Maintenance

### Vercel Analytics

Activez les analytics Vercel pour suivre :
- Trafic
- Performance
- Erreurs

Dans votre projet Vercel → Analytics → Enable

### Supabase Dashboard

Surveillez régulièrement :
- Nombre de requêtes
- Utilisation de stockage
- Connexions actives

### Stripe Dashboard

Vérifiez régulièrement :
- Paiements réussis
- Webhooks (statut Succeeded)
- Clients actifs

---

## 🎉 Félicitations !

Votre application Fetchify est maintenant **EN LIGNE ET OPÉRATIONNELLE** ! 🚀

**Prochaines étapes recommandées :**

1. **Marketing** :
   - Créez du contenu (blog, tutoriels)
   - Partagez sur les réseaux sociaux
   - Contactez des clients potentiels

2. **Optimisation** :
   - Ajoutez Google Analytics
   - Configurez des alertes (Sentry, LogRocket)
   - Optimisez les performances

3. **Support** :
   - Créez une page de support
   - Configurez un email support@fetchify.app
   - Préparez une FAQ

4. **Légal** :
   - Ajoutez des CGV/CGU
   - Politique de confidentialité (RGPD)
   - Mentions légales

---

## 📞 Besoin d'Aide ?

- **Documentation Vercel** : https://vercel.com/docs
- **Documentation Supabase** : https://supabase.com/docs
- **Documentation Stripe** : https://stripe.com/docs

**Bon lancement ! 🚀**

