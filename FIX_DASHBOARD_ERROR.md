# 🔧 Fix Erreur Dashboard - Instructions Urgentes

## ⚠️ L'Erreur Actuelle

```
TypeError: Cannot read properties of undefined (reading 'credits')
```

---

## 🎯 Solution : Déconnexion/Reconnexion OBLIGATOIRE

Le problème vient du fait que votre session actuelle n'est **plus valide** après les modifications de NextAuth.

### 📋 Actions à Faire (DANS L'ORDRE)

#### 1️⃣ **Se Déconnecter Complètement**

Choisissez une de ces méthodes :

**Méthode A : Via l'interface**
- Cliquez sur votre nom en haut à droite
- Cliquez sur "Se déconnecter"

**Méthode B : Via URL directe (RECOMMANDÉ)**
```
http://localhost:3005/api/auth/signout
```
- Ouvrez ce lien dans votre navigateur
- Cliquez sur "Sign out"

#### 2️⃣ **Vider le Cache du Navigateur**

**Sur Chrome/Edge/Brave :**
- Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)

**OU mieux encore :**
- Cmd+Shift+Delete (Mac) ou Ctrl+Shift+Delete (Windows)
- Sélectionner "Cookies et autres données de site"
- Cliquer sur "Effacer les données"

#### 3️⃣ **Se Reconnecter**

```
http://localhost:3005/auth/signin
```
- Email : `mickael.ohayon@gmail.com`
- Mot de passe : votre mot de passe

#### 4️⃣ **Vérifier le Dashboard**

```
http://localhost:3005/dashboard
```
- Le dashboard devrait se charger sans erreur
- Vos crédits devraient s'afficher : **7507**

---

## 🔍 Pourquoi Cette Erreur ?

Après les modifications de NextAuth pour ajouter le champ `isAdmin`, votre session JWT actuelle est **obsolète**. Elle ne contient plus les bonnes informations, ce qui fait que :

1. L'API `/api/user/me` ne vous reconnaît plus correctement
2. `requireAuth()` échoue silencieusement
3. L'API retourne `{ error: "Non authentifié" }`
4. Le dashboard essaie d'accéder à `userData.user` qui est `undefined`
5. ❌ Erreur : "Cannot read properties of undefined"

---

## 🆘 Si Ça Ne Marche Toujours Pas

### Option 1 : Mode Navigation Privée
1. Ouvrez une fenêtre en navigation privée
2. Allez sur `http://localhost:3005/auth/signin`
3. Connectez-vous
4. Testez le dashboard

### Option 2 : Vérifier l'API Manuellement
Ouvrez la console navigateur (F12) puis :
```javascript
fetch('http://localhost:3005/api/user/me')
  .then(r => r.json())
  .then(console.log)
```

**Résultat attendu :**
```json
{
  "user": {
    "id": "...",
    "email": "mickael.ohayon@gmail.com",
    "name": "OHAYON Mickael",
    "credits": 7507,
    "createdAt": "..."
  }
}
```

**Si vous avez :**
```json
{ "error": "Non authentifié" }
```
→ Vous n'êtes pas connecté correctement

### Option 3 : Redémarrer le Serveur Next.js
1. Dans le terminal, appuyez sur `Ctrl+C`
2. Relancez : `PORT=3005 npm run dev`
3. Reconnectez-vous

---

## ✅ Checklist Complète

- [ ] Se déconnecter de l'application
- [ ] Vider le cache du navigateur (Cmd+Shift+R)
- [ ] Se reconnecter avec mickael.ohayon@gmail.com
- [ ] Rafraîchir le dashboard
- [ ] ✨ Plus d'erreur !
- [ ] Les crédits s'affichent : 7507
- [ ] Les statistiques sont visibles
- [ ] Le graphique se charge

---

## 🚨 Important

**NE PAS IGNORER LA DÉCONNEXION !**

Les modifications de NextAuth **nécessitent** une nouvelle session. Sans déconnexion/reconnexion, votre JWT restera invalide et **aucune page ne fonctionnera correctement**.

---

**Suivez ces étapes dans l'ordre et tout devrait fonctionner ! 🎉**

