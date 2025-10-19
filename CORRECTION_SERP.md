# ✅ Correction SERP (Search Engine Results Page)

## 🐛 Problème Identifié

Les requêtes SERP échouaient avec l'erreur suivante :
```
Zyte API error: 400 {"detail":"Format of field serpOptions.extractFrom is invalid"}
```

## 🔍 Cause du Problème

Le type `serp` est un **type d'extraction non-AI** chez Zyte qui :
- ❌ **Ne supporte PAS** le paramètre `extractFrom` dans `serpOptions`
- ✅ Utilise automatiquement `httpResponseBody` (pas de JavaScript)
- ✅ Supporte uniquement `maxItems` pour limiter le nombre de résultats

Le code essayait incorrectement d'ajouter `extractFrom` dans `serpOptions`, ce qui causait une erreur 400 de l'API Zyte.

## ✅ Solution Implémentée

### Fichier `lib/zyte.ts`

**AVANT (incorrect)** :
```typescript
if (type === 'serp') {
  body.serpOptions = {
    extractFrom: extractFrom || 'httpResponseBody', // ❌ Non supporté !
  };
  body.followRedirect = true;
}
```

**APRÈS (correct)** :
```typescript
if (type === 'serp') {
  // SERP est un type non-AI qui utilise httpResponseBody par défaut
  // On ne peut PAS passer extractFrom à serpOptions
  body.serpOptions = {
    maxItems: 10, // Limite aux 10 premiers résultats de recherche
  };
}
```

### Documentation Mise à Jour

Tous les exemples dans `app/[locale]/documentation/page.tsx` ont été corrigés pour retirer le paramètre `source` non supporté :

**AVANT** :
```json
{
  "url": "https://www.google.com/search?q=iphone",
  "type": "serp",
  "source": "httpResponseBody"  // ❌ À retirer
}
```

**APRÈS** :
```json
{
  "url": "https://www.google.com/search?q=iphone",
  "type": "serp"  // ✅ Simple et correct
}
```

## 🧪 Comment Tester SERP

### Test 1 : Recherche Simple

```bash
curl -X POST "http://localhost:3005/api/extract" \
  -H "Authorization: Bearer VOTRE_CLE_API" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com/search?q=iphone+15",
    "type": "serp"
  }'
```

### Test 2 : Recherche avec Géolocalisation

```bash
curl -X POST "http://localhost:3005/api/extract" \
  -H "Authorization: Bearer VOTRE_CLE_API" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com/search?q=restaurants+paris",
    "type": "serp",
    "country": "FR"
  }'
```

### Test 3 : Depuis le Playground

1. Accédez à : `http://localhost:3005/fr/dashboard/playground`
2. Sélectionnez **Type : SERP**
3. Entrez une URL Google Search, par exemple :
   ```
   https://www.google.com/search?q=macbook+pro
   ```
4. Cliquez sur **Test API**

## 📊 Résultat Attendu

Vous obtiendrez les **10 premiers résultats Google** au format JSON :

```json
{
  "success": true,
  "data": {
    "url": "https://www.google.com/search?q=iphone+15",
    "organicResults": [
      {
        "url": "https://www.apple.com/iphone-15/",
        "name": "iPhone 15 - Apple",
        "description": "Description du résultat...",
        "rank": 1
      },
      // ... 9 autres résultats
    ],
    "searchInformation": {
      "totalResults": "1,234,567,890",
      "timeTaken": "0.45"
    }
  },
  "metadata": {
    "extractionType": "serp",
    "source": "httpResponseBody",
    "processingTime": 1234
  }
}
```

## 💰 Coût

Les SERP sont **moins chers** car ils n'utilisent pas d'IA :
- **1 crédit** par requête SERP
- Extraction rapide (pas de JavaScript)
- Pas de rendu de navigateur nécessaire

## 🎯 Cas d'Usage

### 1. Monitoring SEO
Suivez la position de vos pages dans Google :
```javascript
const checkRanking = async (keyword, domain) => {
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
      type: 'serp',
      country: 'FR'
    })
  });
  
  const data = await response.json();
  const results = data.data.organicResults;
  
  const myRank = results.findIndex(r => r.url.includes(domain));
  console.log(`Position pour "${keyword}": ${myRank + 1}`);
};
```

### 2. Analyse de Concurrence
Identifiez qui se positionne sur vos mots-clés :
```javascript
const analyzeCompetitors = async (keyword) => {
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
      type: 'serp'
    })
  });
  
  const data = await response.json();
  const competitors = data.data.organicResults.map(r => ({
    domain: new URL(r.url).hostname,
    title: r.name,
    rank: r.rank
  }));
  
  console.log('Top 10 des concurrents:', competitors);
};
```

### 3. Veille Concurrentielle
Surveillez les tendances et nouveaux contenus :
```javascript
const monitorTrends = async (topic) => {
  const response = await fetch('/api/extract', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: `https://www.google.com/search?q=${encodeURIComponent(topic)}`,
      type: 'serp',
      country: 'FR'
    })
  });
  
  const data = await response.json();
  console.log('Dernières actualités:', data.data.organicResults);
};
```

## ⚠️ Limitations

1. **Rate Limiting Google** : Google peut bloquer temporairement les requêtes automatisées
   - Solution : Espacer les requêtes de quelques secondes
   - Utiliser différents pays (`country` parameter) pour varier les IP

2. **Résultats Personnalisés** : Les résultats peuvent varier selon :
   - La géolocalisation (`country` parameter)
   - L'historique de recherche (utilisez mode incognito/anonyme)
   - La langue du navigateur

3. **Pas de JavaScript** : SERP utilise `httpResponseBody`
   - Plus rapide et moins cher
   - Mais ne capture pas les résultats chargés dynamiquement

## 📝 Résumé

| Aspect | Détails |
|--------|---------|
| **Problème** | `extractFrom` non supporté pour SERP |
| **Solution** | Retirer `extractFrom`, utiliser `maxItems` |
| **Coût** | 1 crédit par requête |
| **Résultats** | Top 10 résultats Google |
| **Géolocalisation** | Supportée via `country` |
| **Méthode** | `httpResponseBody` (automatique) |

---

✅ **Les SERP fonctionnent maintenant correctement !**


