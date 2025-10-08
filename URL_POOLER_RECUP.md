# ✅ URL du Pooler Supabase Récupérée

URL pour la **production sur Vercel** :

```
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
```

---

## 📋 Détails de l'URL

| Composant | Valeur |
|-----------|--------|
| **User** | `postgres.bklfpburxuluzkrtqyoa` |
| **Password** | `pjEpd5OClWhhngDL` |
| **Host** | `aws-1-eu-west-3.pooler.supabase.com` |
| **Port** | `6543` (pooler) |
| **Database** | `postgres` |
| **Région** | EU West 3 (Paris) |

---

## ✅ Vérifications

- ✅ Contient `pooler.supabase.com` (pas juste `supabase.co`)
- ✅ Port `6543` (pas `5432`)
- ✅ Mot de passe présent (pas `[YOUR-PASSWORD]`)
- ✅ Région `eu-west-3` (Paris)

---

## 🎯 Utilisation

### Pour le Développement Local (Actuel)

**Continuez à utiliser** :
```
postgresql://postgres:pjEpd5OClWhhngDL@db.bklfpburxuluzkrtqyoa.supabase.co:5432/postgres
```

- Port `5432` (connexion directe)
- Parfait pour le développement
- Déjà configuré dans `.env` et `.env.local`

### Pour la Production (Vercel)

**Utilisez** :
```
postgresql://postgres.bklfpburxuluzkrtqyoa:pjEpd5OClWhhngDL@aws-1-eu-west-3.pooler.supabase.com:6543/postgres
```

- Port `6543` (pooler)
- Supporte beaucoup plus de connexions
- À configurer dans les variables d'environnement Vercel

---

## 🚀 Prochaines Étapes

1. ✅ **URL du pooler récupérée** ← Vous êtes ici
2. 🔄 **Passer Stripe en mode LIVE**
3. 🔄 **Pousser le code sur GitHub**
4. 🔄 **Déployer sur Vercel avec cette URL**
5. 🔄 **Configurer le domaine OVH**

**Suivez le guide** : `MISE_EN_LIGNE_COMPLETE.md`

---

## 💡 Pourquoi 2 URLs différentes ?

| Aspect | Connexion Directe (5432) | Pooler (6543) |
|--------|--------------------------|---------------|
| **Connexions max** | ~25 | 200+ |
| **Serverless** | ❌ Problèmes | ✅ Optimisé |
| **Vercel** | ❌ Crashs | ✅ Stable |
| **Dev local** | ✅ Parfait | ✅ Aussi OK |

**Vercel crée beaucoup de connexions** (une par fonction serverless), donc le pooler est indispensable !

---

## 📝 Note

Cette URL sera utilisée comme variable d'environnement `DATABASE_URL` dans Vercel lors du déploiement.

**Ne la commitez jamais sur GitHub !** Elle contient votre mot de passe.

