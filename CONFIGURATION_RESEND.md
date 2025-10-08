# 📧 Configuration de Resend pour les emails

## 🎯 Qu'est-ce que Resend ?

Resend est un service d'envoi d'emails moderne et simple. Il est utilisé pour envoyer :
- **Codes de vérification** d'email à l'inscription
- **Emails de bienvenue** avec crédits offerts
- **Liens de réinitialisation** de mot de passe

---

## 📝 Étapes de configuration

### 1️⃣ Créer un compte Resend

1. Allez sur : https://resend.com
2. Cliquez sur **"Sign Up"**
3. Créez votre compte gratuitement

---

### 2️⃣ Obtenir la clé API

1. Connectez-vous à votre dashboard Resend
2. Allez dans **"API Keys"** (menu de gauche)
3. Cliquez sur **"Create API Key"**
4. Donnez un nom à votre clé (ex: "Fetchify Production")
5. **COPIEZ LA CLÉ IMMÉDIATEMENT** (elle ne sera plus affichée après)

---

### 3️⃣ Configuration du domaine d'envoi (Optionnel mais recommandé)

**Pour les tests (mode gratuit)** :
- Utilisez l'adresse par défaut : `onboarding@resend.dev`
- Limite : 100 emails/jour

**Pour la production** :
1. Allez dans **"Domains"**
2. Cliquez sur **"Add Domain"**
3. Entrez votre domaine : `fetchify.app`
4. Suivez les instructions pour ajouter les enregistrements DNS (TXT, MX, CNAME)
5. Attendez la vérification (quelques minutes à quelques heures)

---

### 4️⃣ Ajouter la clé API localement

Créez ou modifiez votre fichier `.env.local` :

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email d'expédition (utilisez onboarding@resend.dev pour les tests)
EMAIL_FROM="Fetchify <noreply@fetchify.app>"
```

---

### 5️⃣ Ajouter la clé API sur Vercel

1. Allez sur : https://vercel.com/miko51s-projects/fetchify/settings/environment-variables
2. Ajoutez deux nouvelles variables :

**Variable 1** :
- **Key** : `RESEND_API_KEY`
- **Value** : `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (votre clé Resend)
- **Environments** : Production, Preview, Development

**Variable 2** :
- **Key** : `EMAIL_FROM`
- **Value** : `Fetchify <noreply@fetchify.app>` (ou `Fetchify <onboarding@resend.dev>` pour les tests)
- **Environments** : Production, Preview, Development

3. Cliquez sur **"Save"**
4. Redéployez l'application

---

## ✅ Tester localement

1. Inscrivez un nouvel utilisateur sur : http://localhost:3005/fr/auth/signup
2. Vérifiez que vous recevez bien un email avec le code de vérification
3. Testez le flux complet :
   - ✅ Inscription
   - ✅ Réception du code
   - ✅ Vérification du code
   - ✅ Réception de l'email de bienvenue
   - ✅ Connexion automatique

---

## 🔍 Vérifier les emails envoyés

Dans le dashboard Resend :
1. Allez dans **"Logs"**
2. Vous verrez tous les emails envoyés avec leur statut
3. Cliquez sur un email pour voir les détails (contenu, erreurs, etc.)

---

## 💡 Limites du plan gratuit

- **100 emails/jour**
- **1 domaine personnalisé**
- **Support email uniquement**

Pour plus, consultez : https://resend.com/pricing

---

## 🆘 Dépannage

**❌ Emails non reçus** :
1. Vérifiez vos spams
2. Vérifiez les logs Resend
3. Vérifiez que `RESEND_API_KEY` est bien configurée
4. Vérifiez que le domaine est vérifié (pour production)

**❌ Erreur "Authentication failed"** :
- La clé API est incorrecte ou expirée
- Générez une nouvelle clé sur Resend

**❌ Erreur "Daily limit exceeded"** :
- Vous avez dépassé la limite de 100 emails/jour
- Passez à un plan supérieur

---

## 📚 Ressources

- Documentation Resend : https://resend.com/docs
- Support : support@resend.com
- Status : https://status.resend.com

