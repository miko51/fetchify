# 📚 Documentation de l'API

Documentation complète de l'API de crawl de produits.

## 🔗 Endpoint principal

```
GET /api/v1/product-crawl
```

Base URL :
- **Développement** : `http://localhost:3000`
- **Production** : `https://votre-domaine.com`

## 🔐 Authentification

L'API utilise des clés API pour l'authentification. Vous devez inclure votre clé dans les headers de chaque requête.

### Header requis

```
X-API-Key: sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

ou

```
Authorization: Bearer sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Obtenir une clé API

1. Créez un compte sur la plateforme
2. Allez dans **Dashboard** > **Clés API**
3. Cliquez sur **Nouvelle clé**
4. Donnez un nom à votre clé
5. Copiez la clé générée (elle commence par `sk_`)

⚠️ **Important** : Conservez votre clé secrète en lieu sûr. Ne la partagez jamais publiquement.

## 📝 Paramètres

### Query Parameters

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `url` | string | Oui | URL complète du produit à crawler |

### Exemple d'URL

```
/api/v1/product-crawl?url=https://www.amazon.fr/dp/B0B1VQ1ZQY
```

## 📤 Requête

### cURL

```bash
curl -X GET "https://votre-domaine.com/api/v1/product-crawl?url=https://www.amazon.fr/dp/B0B1VQ1ZQY" \
  -H "X-API-Key: sk_votre_cle_api"
```

### JavaScript (Fetch)

```javascript
const response = await fetch(
  'https://votre-domaine.com/api/v1/product-crawl?url=https://www.amazon.fr/dp/B0B1VQ1ZQY',
  {
    method: 'GET',
    headers: {
      'X-API-Key': 'sk_votre_cle_api',
    },
  }
);

const data = await response.json();
console.log(data);
```

### Python (requests)

```python
import requests

url = "https://votre-domaine.com/api/v1/product-crawl"
params = {"url": "https://www.amazon.fr/dp/B0B1VQ1ZQY"}
headers = {"X-API-Key": "sk_votre_cle_api"}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print(data)
```

### Node.js (axios)

```javascript
const axios = require('axios');

const response = await axios.get(
  'https://votre-domaine.com/api/v1/product-crawl',
  {
    params: {
      url: 'https://www.amazon.fr/dp/B0B1VQ1ZQY',
    },
    headers: {
      'X-API-Key': 'sk_votre_cle_api',
    },
  }
);

console.log(response.data);
```

### PHP

```php
<?php
$url = "https://votre-domaine.com/api/v1/product-crawl?url=" . 
       urlencode("https://www.amazon.fr/dp/B0B1VQ1ZQY");

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-Key: sk_votre_cle_api"
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);
?>
```

## 📥 Réponse

### Réponse réussie (200)

```json
{
  "data": {
    // Données du produit retournées par l'API n8n
    "title": "Nom du produit",
    "price": 29.99,
    "description": "Description du produit",
    // ... autres champs selon l'API
  },
  "credits": {
    "remaining": 99,
    "used": 1
  }
}
```

### Structure de la réponse

| Champ | Type | Description |
|-------|------|-------------|
| `data` | object | Données du produit crawlé |
| `credits.remaining` | number | Nombre de crédits restants |
| `credits.used` | number | Nombre de crédits consommés pour cet appel |

## ❌ Codes d'erreur

### 400 - Bad Request

L'URL est manquante ou invalide.

```json
{
  "error": "Paramètre 'url' manquant"
}
```

### 401 - Unauthorized

La clé API est manquante ou invalide.

```json
{
  "error": "Clé API manquante. Utilisez le header 'X-API-Key' ou 'Authorization: Bearer YOUR_KEY'"
}
```

ou

```json
{
  "error": "Clé API invalide"
}
```

### 402 - Payment Required

Vous n'avez plus de crédits disponibles.

```json
{
  "error": "Crédits insuffisants",
  "credits": 0,
  "message": "Veuillez acheter des crédits pour continuer à utiliser l'API"
}
```

### 403 - Forbidden

Votre clé API a été désactivée.

```json
{
  "error": "Clé API désactivée"
}
```

### 500 - Internal Server Error

Erreur lors de l'appel à l'API externe ou erreur serveur.

```json
{
  "error": "Erreur interne du serveur"
}
```

## 💳 Système de crédits

### Comment ça marche ?

- Chaque appel à l'API consomme **1 crédit**
- Les crédits sont déduits **avant** l'appel à l'API externe
- Si l'API externe retourne une erreur, le crédit est quand même consommé
- Les crédits n'expirent jamais

### Acheter des crédits

Vous pouvez acheter des crédits via :
1. **Dashboard** > **Crédits**
2. Sélectionnez un pack
3. Payez via Stripe

### Packs disponibles

| Pack | Crédits | Prix | Prix/crédit |
|------|---------|------|-------------|
| Starter | 100 | 9,99€ | 0,0999€ |
| Pro | 500 | 39,99€ | 0,0799€ |
| Enterprise | 2000 | 129,99€ | 0,0649€ |

## 📊 Limites et quotas

| Limite | Valeur |
|--------|--------|
| Requêtes par seconde | Illimité* |
| Taille max de l'URL | 2048 caractères |
| Timeout | 30 secondes |
| Clés API par compte | Illimité |

*Nous recommandons d'implémenter votre propre rate limiting côté client pour éviter de consommer trop de crédits rapidement.

## 🔄 Bonnes pratiques

### 1. Gestion des erreurs

Toujours vérifier le statut de la réponse :

```javascript
const response = await fetch(apiUrl, options);

if (!response.ok) {
  const error = await response.json();
  
  if (response.status === 402) {
    // Plus de crédits
    console.error('Achetez des crédits !');
  } else if (response.status === 401) {
    // Clé invalide
    console.error('Vérifiez votre clé API');
  } else {
    console.error('Erreur:', error.error);
  }
  return;
}

const data = await response.json();
```

### 2. Surveiller les crédits

Vérifiez vos crédits restants après chaque appel :

```javascript
const data = await response.json();

if (data.credits.remaining < 10) {
  console.warn('Attention : il ne vous reste que', data.credits.remaining, 'crédits');
}
```

### 3. Cacher les résultats

Pour économiser des crédits, mettez en cache les résultats fréquemment demandés :

```javascript
const cache = new Map();

async function getCachedProduct(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const data = await fetchFromAPI(url);
  cache.set(url, data);
  return data;
}
```

### 4. Retry avec backoff

En cas d'erreur temporaire, réessayez avec un délai croissant :

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return await response.json();
      
      if (response.status >= 500) {
        // Erreur serveur, on peut réessayer
        await sleep(1000 * Math.pow(2, i)); // 1s, 2s, 4s
        continue;
      }
      
      // Autre erreur, on ne réessaye pas
      throw new Error(await response.text());
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

## 🛠️ Outils de test

### Playground en ligne

Le moyen le plus simple de tester l'API :
1. Allez dans **Dashboard** > **Playground**
2. Sélectionnez une clé API
3. Entrez une URL de produit
4. Cliquez sur "Tester l'API"

### Postman

Importez cette collection Postman :

```json
{
  "info": {
    "name": "Product Crawl API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Crawl Product",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "X-API-Key",
            "value": "{{api_key}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/v1/product-crawl?url={{product_url}}",
          "host": ["{{base_url}}"],
          "path": ["api", "v1", "product-crawl"],
          "query": [
            {
              "key": "url",
              "value": "{{product_url}}"
            }
          ]
        }
      }
    }
  ]
}
```

Variables :
- `base_url`: `https://votre-domaine.com`
- `api_key`: Votre clé API
- `product_url`: URL du produit à tester

## 📞 Support

### Besoin d'aide ?

- 📧 Email : support@example.com
- 💬 Chat : Disponible dans le dashboard
- 📚 Documentation : https://votre-domaine.com/docs

### Signaler un bug

Si vous rencontrez un problème :
1. Vérifiez cette documentation
2. Consultez les logs dans le dashboard
3. Contactez le support avec :
   - Votre clé API (masquée : `sk_...xxxx`)
   - L'URL testée
   - Le message d'erreur complet
   - L'heure de la requête

## 🔄 Changelog

### v1.0.0 - 2024
- 🎉 Version initiale
- ✅ Endpoint principal de crawl
- ✅ Authentification par clé API
- ✅ Système de crédits
- ✅ Intégration Stripe

---

Dernière mise à jour : 2024

