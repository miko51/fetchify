# 🔑 Résoudre l'Authentification GitHub

GitHub a désactivé l'authentification par mot de passe en 2021. Vous devez utiliser un **Personal Access Token (PAT)**.

---

## 🎯 Solution Rapide : Personal Access Token

### Étape 1 : Créer un Token sur GitHub (2 min)

1. **Allez sur GitHub** : https://github.com/settings/tokens

2. **Cliquez sur "Generate new token"** → **"Generate new token (classic)"**

3. **Configurez le token** :
   - **Note** : `Fetchify App Deployment`
   - **Expiration** : 90 days (ou No expiration si vous voulez)
   - **Permissions** (cochez ces cases) :
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)

4. **Cliquez sur "Generate token"**

5. **⚠️ COPIEZ LE TOKEN IMMÉDIATEMENT** :
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   **Vous ne pourrez plus le voir après !**

---

### Étape 2 : Utiliser le Token pour Push

Au lieu de votre mot de passe GitHub, **utilisez le token** :

```bash
# Quand GitHub demande le mot de passe, collez le TOKEN (pas votre mot de passe)
git push -u origin main
```

**Quand il demande** :
- `Username` : `miko51` (ou votre username GitHub)
- `Password` : **COLLEZ VOTRE TOKEN** (commence par `ghp_...`)

---

## 🔄 Alternative : Utiliser SSH (Plus Sécurisé)

Si vous préférez ne pas utiliser de token, configurez SSH :

### 1. Générer une clé SSH

```bash
# Générer une nouvelle clé SSH
ssh-keygen -t ed25519 -C "mickael.ohayon@gmail.com"

# Appuyez sur Entrée 3 fois (pas de passphrase pour simplifier)
```

### 2. Copier la clé publique

```bash
# Copier la clé publique
cat ~/.ssh/id_ed25519.pub | pbcopy
```

### 3. Ajouter la clé sur GitHub

1. **Allez sur** : https://github.com/settings/keys
2. **Cliquez sur "New SSH key"**
3. **Title** : `MacBook Pro Fetchify`
4. **Key** : Collez la clé copiée (Cmd+V)
5. **Cliquez sur "Add SSH key"**

### 4. Changer l'URL du repo vers SSH

```bash
# Changer l'URL remote de HTTPS vers SSH
git remote set-url origin git@github.com:miko51/fetchify.git
```

### 5. Push avec SSH

```bash
git push -u origin main
```

---

## ✅ Méthode Recommandée : Token + Sauvegarder dans Keychain

Pour ne pas avoir à rentrer le token à chaque fois :

### 1. Configurer Git pour utiliser le Keychain macOS

```bash
git config --global credential.helper osxkeychain
```

### 2. Push une première fois avec le token

```bash
git push -u origin main
# Username: miko51
# Password: [VOTRE_TOKEN]
```

### 3. Git sauvegarde automatiquement le token

Les prochains push se feront automatiquement sans redemander le token ! ✨

---

## 🚨 Si le repo n'existe pas encore sur GitHub

### 1. Créer le repo sur GitHub

1. **Allez sur** : https://github.com/new
2. **Repository name** : `fetchify`
3. **Description** : `Fetchify - Product Data API SaaS Platform`
4. **Private** (recommandé)
5. **NE cochez PAS** "Initialize with README" (vous avez déjà du code)
6. **Cliquez sur "Create repository"**

### 2. Lier votre repo local

```bash
git remote add origin https://github.com/miko51/fetchify.git
git branch -M main
git push -u origin main
```

**Utilisez le TOKEN comme mot de passe !**

---

## 📝 Récapitulatif Rapide

### Pour Pousser MAINTENANT :

```bash
# 1. Créez un token sur https://github.com/settings/tokens
# 2. Copiez le token (commence par ghp_...)
# 3. Exécutez :

git push -u origin main

# Quand demandé :
# Username: miko51
# Password: [COLLEZ_VOTRE_TOKEN_ICI]
```

**⚠️ Le token n'est PAS votre mot de passe GitHub !**  
C'est un token spécial qui commence par `ghp_...`

---

## 🔒 Sécurité

**NE COMMITEZ JAMAIS** :
- ❌ Votre token GitHub
- ❌ Vos fichiers `.env` ou `.env.local`
- ❌ Vos clés Stripe

**Vérifiez votre `.gitignore`** :
```bash
cat .gitignore | grep -E ".env|token"
```

Vous devriez voir :
```
.env*.local
.env
```

---

## 💡 Token vs SSH : Lequel Choisir ?

| Méthode | Avantages | Inconvénients |
|---------|-----------|---------------|
| **Token (PAT)** | ✅ Simple<br>✅ Rapide à configurer<br>✅ Marche partout | ⚠️ Expire (90 jours)<br>⚠️ À regénérer régulièrement |
| **SSH** | ✅ Permanent<br>✅ Plus sécurisé<br>✅ Pas d'expiration | ⚠️ Configuration initiale plus longue<br>⚠️ Une clé par machine |

**Recommandation** : Commencez avec un **Token** pour aller vite, passez à **SSH** plus tard.

---

## 🆘 Problèmes Courants

### "Support for password authentication was removed"

**Cause** : Vous utilisez votre mot de passe GitHub au lieu du token

**Solution** : Créez un token et utilisez-le comme mot de passe

### "Permission denied (publickey)"

**Cause** : Votre clé SSH n'est pas configurée correctement

**Solution** : Vérifiez que la clé est bien ajoutée sur GitHub :
```bash
ssh -T git@github.com
# Devrait afficher : Hi miko51! You've successfully authenticated
```

### "Repository not found"

**Cause** : Le repo n'existe pas sur GitHub ou l'URL est incorrecte

**Solution** : Créez le repo sur GitHub d'abord, puis :
```bash
git remote -v  # Vérifier l'URL
git remote set-url origin https://github.com/miko51/fetchify.git
```

---

## ✅ Checklist Complète

Avant de continuer la mise en ligne :

- [ ] ✅ Token GitHub créé et copié
- [ ] ✅ Git configuré pour utiliser le keychain
- [ ] ✅ Code poussé sur GitHub avec succès
- [ ] ✅ `.gitignore` contient `.env` et `.env.local`
- [ ] ✅ Vérification : les secrets ne sont PAS sur GitHub

**Une fois le code sur GitHub, vous pouvez continuer avec Vercel ! 🚀**

