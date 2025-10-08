# 🔧 Fix Accès Admin - Instructions

## ✅ Corrections Apportées

Le problème d'accès à l'administration a été corrigé ! Les modifications suivantes ont été faites :

### 1. **NextAuth Configuration** (`app/api/auth/[...nextauth]/route.ts`)
- ✅ Ajout du champ `isAdmin` dans le retour de `authorize`
- ✅ Propagation de `isAdmin` dans le callback `jwt`
- ✅ Ajout de `isAdmin` dans le callback `session`

### 2. **Helper Auth** (`lib/auth.ts`)
- ✅ Ajout du champ `isAdmin` dans la sélection de `getCurrentUser`

### 3. **Helper Admin** (`lib/admin.ts`)
- ✅ Correction de l'import de `authOptions`

---

## 🔄 Actions Requises

Pour que les modifications prennent effet, vous devez vous **déconnecter** et **reconnecter** :

### Étapes :

1. **Se déconnecter**
   - Cliquez sur votre nom en haut à droite
   - Cliquez sur "Se déconnecter"
   - OU allez directement sur : `http://localhost:3005/api/auth/signout`

2. **Se reconnecter**
   - Allez sur : `http://localhost:3005/auth/signin`
   - Connectez-vous avec : `mickael.ohayon@gmail.com`

3. **Accéder à l'Admin**
   - Cliquez sur l'onglet "Admin" dans la sidebar
   - OU allez directement sur : `http://localhost:3005/admin`

---

## ✨ Ce Qui Était Le Problème

### Avant
```typescript
// La session ne contenait pas isAdmin
session.user = {
  id: "xxx",
  email: "mickael.ohayon@gmail.com",
  name: "OHAYON Mickael"
  // ❌ isAdmin manquant !
}
```

### Après
```typescript
// La session contient maintenant isAdmin
session.user = {
  id: "xxx",
  email: "mickael.ohayon@gmail.com",
  name: "OHAYON Mickael",
  isAdmin: true // ✅ Présent !
}
```

---

## 🔐 Vérification Rapide

Pour vérifier que votre compte est bien admin, ouvrez Prisma Studio :

```bash
npx prisma studio
```

Puis dans la table `users`, cherchez votre email et vérifiez que `isAdmin = true` (case cochée).

---

## 🎉 Une Fois Reconnecté

Vous aurez accès à :

### 📊 Dashboard Admin
- Statistiques globales
- Nombre d'utilisateurs
- Revenus totaux
- Packages actifs

### 📦 Gestion des Packages
- Créer/Modifier/Supprimer des packs de crédits
- Gérer les prix
- Marquer comme populaire
- Activer/Désactiver

### 👥 Gestion des Utilisateurs
- Liste complète des utilisateurs
- Voir les crédits de chacun
- Statistiques par utilisateur

---

## ⚠️ Important

**La déconnexion/reconnexion est obligatoire** car :
- Les sessions NextAuth utilisent des JWT
- Le JWT est créé à la connexion avec les données de ce moment
- Il faut créer un nouveau JWT avec le champ `isAdmin`
- Sans reconnexion, l'ancien JWT (sans `isAdmin`) est encore utilisé

---

## 🐛 En Cas de Problème

Si après reconnexion vous n'avez toujours pas accès :

1. **Vérifier la base de données**
   ```bash
   npx prisma studio
   ```
   → Vérifier que `isAdmin = true` pour votre compte

2. **Vérifier les logs du serveur**
   - Regarder le terminal Next.js pour les erreurs

3. **Vider le cache du navigateur**
   - Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)

4. **Réexécuter le script admin**
   ```bash
   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/make-admin.ts
   ```

---

## ✅ Checklist

- [ ] Se déconnecter de l'application
- [ ] Se reconnecter avec `mickael.ohayon@gmail.com`
- [ ] Voir l'onglet "Admin" dans la sidebar
- [ ] Cliquer sur "Admin"
- [ ] Accéder au dashboard admin avec succès
- [ ] Tester la gestion des packages
- [ ] Tester la gestion des utilisateurs

---

**Tout est prêt ! Déconnectez-vous, reconnectez-vous, et profitez de votre panel admin ! 🚀**

