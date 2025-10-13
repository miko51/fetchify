# 🔧 Configuration Zyte API

## ⚠️ IMPORTANT : Configuration requise

Pour que les nouvelles fonctionnalités d'extraction fonctionnent, vous devez ajouter la clé API Zyte dans vos variables d'environnement.

## 📝 Variables d'environnement

Ajoutez cette ligne dans vos fichiers `.env` et `.env.local` :

```bash
# Zyte API - Service d'extraction de données (jamais exposé aux clients)
ZYTE_API_KEY=f9caa268490146b788427cb014c425fc
```

## 🔒 Sécurité

- ⚠️ **Cette clé ne doit JAMAIS être exposée publiquement**
- ✅ Elle est utilisée uniquement côté serveur (API routes)
- ✅ Les clients Fetchify ne sauront jamais que Zyte est utilisé
- ✅ La mention "Zyte" n'apparaît nulle part dans l'interface utilisateur

## 📦 Configuration locale

### Étape 1 : Mettre à jour `.env.local`

```bash
# Ouvrez le fichier .env.local
nano .env.local

# Ajoutez cette ligne à la fin du fichier
ZYTE_API_KEY=f9caa268490146b788427cb014c425fc
```

### Étape 2 : Redémarrer le serveur

```bash
# Arrêtez le serveur actuel (Ctrl+C)
# Puis relancez-le
PORT=3005 npm run dev
```

## ☁️ Configuration Vercel (Production)

### Via l'interface Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet `fetchify-app`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez une nouvelle variable :
   - **Name**: `ZYTE_API_KEY`
   - **Value**: `f9caa268490146b788427cb014c425fc`
   - **Environments**: Production, Preview, Development (cochez les 3)
5. Cliquez sur **Save**
6. **Redéployez** votre application pour appliquer les changements

### Via la CLI Vercel (alternative)

```bash
# Ajoutez la variable
vercel env add ZYTE_API_KEY

# Quand demandé, entrez la valeur
f9caa268490146b788427cb014c425fc

# Sélectionnez les environnements : Production, Preview, Development

# Redéployez
vercel --prod
```

## ✅ Vérification

Une fois configuré, votre API pourra utiliser les nouvelles routes d'extraction :

```bash
# Test local
curl -X POST http://localhost:3005/api/extract \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
    "type": "product"
  }'
```

## 🎯 Nouveaux types d'extraction disponibles

Une fois configuré, Fetchify supportera ces types d'extraction :

- **`product`** - Page produit unique
- **`productList`** - Liste de produits
- **`productNavigation`** - Navigation produits
- **`article`** - Article unique
- **`articleList`** - Liste d'articles
- **`articleNavigation`** - Navigation articles
- **`forumThread`** - Thread de forum
- **`jobPosting`** - Offre d'emploi unique
- **`jobPostingNavigation`** - Liste d'offres d'emploi
- **`pageContent`** - Contenu générique de page
- **`serp`** - Résultats de recherche Google

## 💰 Coût par extraction

Les crédits sont automatiquement déduits du compte de l'utilisateur :

| Type d'extraction | httpResponseBody | browserHtmlOnly | browserHtml |
|-------------------|------------------|-----------------|-------------|
| product           | 1 crédit         | 2 crédits       | 3 crédits   |
| productList       | 2 crédits        | 3 crédits       | 5 crédits   |
| article           | 1 crédit         | 2 crédits       | 3 crédits   |
| serp              | 1 crédit         | 1 crédit        | 2 crédits   |

## 🌍 Géolocalisation

Vous pouvez spécifier un code pays (ISO 3166-1 alpha-2) :

```json
{
  "url": "https://example.com",
  "type": "product",
  "country": "FR"
}
```

Codes pays supportés : `FR`, `US`, `GB`, `DE`, `ES`, `IT`, `CA`, etc.

---

✨ **Une fois configuré, Fetchify devient une interface simplifiée et élégante pour l'extraction de données web !**

