# 🔐 Guide de Connexion - Étapes Précises

## ✅ Serveur Redémarré

Le serveur a été complètement redémarré avec :
- ✅ Cache Next.js supprimé
- ✅ Reconstruction complète
- ✅ Configuration NextAuth fraîche

---

## 📋 Étapes de Connexion (À SUIVRE EXACTEMENT)

### Étape 1️⃣ : Vider le Cache du Navigateur

**IMPORTANT : Ne pas sauter cette étape !**

#### Option A : Rechargement forcé
- **Mac** : Cmd + Shift + R
- **Windows** : Ctrl + Shift + R

#### Option B : Effacer les cookies (RECOMMANDÉ)
1. Ouvrir les DevTools : F12
2. Aller dans l'onglet "Application" (Chrome) ou "Stockage" (Firefox)
3. Dans le menu de gauche : "Cookies" → "http://localhost:3005"
4. Cliquer droit → "Clear" ou tout supprimer
5. Fermer les DevTools

#### Option C : Navigation Privée (PLUS SIMPLE)
1. Ouvrir une fenêtre en **navigation privée/incognito**
2. Aller sur `http://localhost:3005`

---

### Étape 2️⃣ : Aller à la Page de Connexion

```
http://localhost:3005/auth/signin
```

Vous devriez voir :
- Un formulaire de connexion moderne
- Fond bleu/violet avec effets
- Champs Email et Mot de passe

---

### Étape 3️⃣ : Se Connecter

**Email :**
```
mickael.ohayon@gmail.com
```

**Mot de passe :**
Votre mot de passe habituel

**Puis cliquer sur "Se connecter"**

---

### Étape 4️⃣ : Vérification

Après connexion réussie, vous devriez être redirigé vers :
```
http://localhost:3005/dashboard
```

Et voir :
- ✅ "Bienvenue, OHAYON Mickael"
- ✅ 4 cartes de statistiques
- ✅ Vos crédits : 7507
- ✅ Le graphique de consommation
- ✅ L'onglet "Admin" dans la sidebar

---

## 🐛 Si Ça Ne Marche Toujours Pas

### Diagnostic 1 : Vérifier que le serveur tourne

Ouvrez un terminal et tapez :
```bash
lsof -i :3005
```

Vous devriez voir un processus `node` en cours d'exécution.

### Diagnostic 2 : Vérifier les logs du serveur

Dans le terminal où le serveur tourne, regardez s'il y a des erreurs en rouge.

### Diagnostic 3 : Tester l'API de connexion

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Network"
3. Essayez de vous connecter
4. Cherchez la requête vers `/api/auth/callback/credentials`
5. Regardez la réponse :
   - **200** = Succès ✅
   - **401** = Mauvais identifiants ❌
   - **500** = Erreur serveur ❌

### Diagnostic 4 : Réinitialiser le mot de passe

Si vous avez oublié votre mot de passe, créez un nouveau compte admin :

```bash
cd "/Users/mickaelohayon/Dropbox/Mon Mac (MacBook-Pro-de-Mickael.local)/Downloads/Api products crawl"
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/make-admin.ts
```

---

## 🔑 Vérifier Votre Compte dans Prisma Studio

Prisma Studio est déjà ouvert sur `http://localhost:5555`

1. Aller dans la table `users`
2. Chercher `mickael.ohayon@gmail.com`
3. Vérifier que :
   - ✅ `isAdmin` est coché (true)
   - ✅ `credits` = 7507
   - ✅ Le `password` est présent (hash bcrypt)

---

## 🆘 Solution de Dernier Recours

Si vraiment rien ne fonctionne, créez un nouveau compte :

1. **Aller sur l'inscription :**
   ```
   http://localhost:3005/auth/signup
   ```

2. **Créer un nouveau compte avec un autre email**

3. **Le passer en admin via Prisma Studio :**
   - Ouvrir `http://localhost:5555`
   - Table `users`
   - Trouver le nouveau compte
   - Cocher `isAdmin`
   - Sauvegarder

4. **Se connecter avec le nouveau compte**

---

## ✅ Checklist Finale

- [ ] Cache navigateur vidé (Cmd+Shift+R ou navigation privée)
- [ ] Page de connexion chargée (http://localhost:3005/auth/signin)
- [ ] Email et mot de passe entrés correctement
- [ ] Bouton "Se connecter" cliqué
- [ ] Redirection vers /dashboard
- [ ] Dashboard chargé sans erreur
- [ ] Statistiques affichées
- [ ] Onglet "Admin" visible

---

**Si vous suivez ces étapes en navigation privée, ça devrait fonctionner à 100% ! 🎯**

