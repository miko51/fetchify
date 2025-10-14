# 🌍 Support des Domaines Google Locaux pour SERP

## 🎯 Problème Résolu

**Avant** : Peu importe le pays sélectionné, l'URL générée était toujours `https://www.google.com/search?q=...`

**Résultat** : Les résultats de recherche ne correspondaient pas au pays ciblé.

**Après** : L'URL s'adapte automatiquement au domaine Google local du pays sélectionné.

## ✨ Fonctionnement

### Google : Domaines Locaux

Quand vous sélectionnez un pays, l'URL utilise maintenant le domaine Google correspondant :

| Pays | Code | Domaine Google | Exemple d'URL |
|------|------|----------------|---------------|
| 🇺🇸 United States | US | google.com | https://www.google.com/search?q=iphone |
| 🇫🇷 France | FR | google.fr | https://www.google.fr/search?q=iphone |
| 🇬🇧 United Kingdom | GB | google.co.uk | https://www.google.co.uk/search?q=iphone |
| 🇩🇪 Germany | DE | google.de | https://www.google.de/search?q=iphone |
| 🇪🇸 Spain | ES | google.es | https://www.google.es/search?q=iphone |
| 🇮🇹 Italy | IT | google.it | https://www.google.it/search?q=iphone |
| 🇨🇦 Canada | CA | google.ca | https://www.google.ca/search?q=iphone |
| 🇦🇺 Australia | AU | google.com.au | https://www.google.com.au/search?q=iphone |
| 🇧🇷 Brazil | BR | google.com.br | https://www.google.com.br/search?q=iphone |
| 🇲🇽 Mexico | MX | google.com.mx | https://www.google.com.mx/search?q=iphone |
| 🇳🇱 Netherlands | NL | google.nl | https://www.google.nl/search?q=iphone |
| 🇧🇪 Belgium | BE | google.be | https://www.google.be/search?q=iphone |
| 🇵🇱 Poland | PL | google.pl | https://www.google.pl/search?q=iphone |
| 🇮🇳 India | IN | google.co.in | https://www.google.co.in/search?q=iphone |
| 🇯🇵 Japan | JP | google.co.jp | https://www.google.co.jp/search?q=iphone |
| 🇰🇷 South Korea | KR | google.co.kr | https://www.google.co.kr/search?q=iphone |
| 🇨🇳 China | CN | google.cn | https://www.google.cn/search?q=iphone |
| 🇹🇷 Turkey | TR | google.com.tr | https://www.google.com.tr/search?q=iphone |
| 🇷🇺 Russia | RU | google.ru | https://www.google.ru/search?q=iphone |
| 🇿🇦 South Africa | ZA | google.co.za | https://www.google.co.za/search?q=iphone |

### Bing : Paramètre Country Code

Pour Bing, l'URL utilise le paramètre `cc` (country code) :

```
https://www.bing.com/search?q=iphone&cc=FR
```

Bing redirige automatiquement vers le domaine local approprié.

## 📊 Exemples Concrets

### Exemple 1 : Recherche France

**Configuration** :
- Search Engine : Google
- Search Query : "restaurant paris"
- Country : 🇫🇷 France

**URL Générée** :
```
https://www.google.fr/search?q=restaurant%20paris
```

**Résultats** : Restaurants à Paris avec résultats français (sites .fr, langue française)

---

### Exemple 2 : Recherche Royaume-Uni

**Configuration** :
- Search Engine : Google
- Search Query : "best smartphone"
- Country : 🇬🇧 United Kingdom

**URL Générée** :
```
https://www.google.co.uk/search?q=best%20smartphone
```

**Résultats** : Résultats britanniques (sites .co.uk, prix en £, anglais britannique)

---

### Exemple 3 : Recherche Japon

**Configuration** :
- Search Engine : Google
- Search Query : "カメラ" (camera)
- Country : 🇯🇵 Japan

**URL Générée** :
```
https://www.google.co.jp/search?q=%E3%82%AB%E3%83%A1%E3%83%A9
```

**Résultats** : Résultats japonais (sites .jp, langue japonaise, prix en ¥)

---

### Exemple 4 : Bing France

**Configuration** :
- Search Engine : Bing
- Search Query : "actualités france"
- Country : 🇫🇷 France

**URL Générée** :
```
https://www.bing.com/search?q=actualit%C3%A9s%20france&cc=FR
```

**Résultats** : Résultats français de Bing

## 🔧 Implémentation Technique

### Code Source

```typescript
// Mapping des codes pays vers les domaines Google
const getGoogleDomain = (country: string): string => {
  const googleDomains: Record<string, string> = {
    'US': 'google.com',
    'FR': 'google.fr',
    'GB': 'google.co.uk',
    'DE': 'google.de',
    'ES': 'google.es',
    'IT': 'google.it',
    'CA': 'google.ca',
    'AU': 'google.com.au',
    'BR': 'google.com.br',
    'MX': 'google.com.mx',
    'NL': 'google.nl',
    'BE': 'google.be',
    'PL': 'google.pl',
    'IN': 'google.co.in',
    'JP': 'google.co.jp',
    'KR': 'google.co.kr',
    'CN': 'google.cn',
    'TR': 'google.com.tr',
    'RU': 'google.ru',
    'ZA': 'google.co.za',
  };
  return googleDomains[country] || 'google.com';
};

// Génération de l'URL selon le moteur et le pays
const generateFinalUrl = () => {
  if (extractionType === 'serp') {
    const query = searchQuery || "example query";
    const encodedQuery = encodeURIComponent(query);
    
    if (searchEngine === 'google') {
      const domain = getGoogleDomain(countryCode);
      return `https://www.${domain}/search?q=${encodedQuery}`;
    } else {
      // Bing utilise le paramètre cc pour le pays
      return `https://www.bing.com/search?q=${encodedQuery}${countryCode ? `&cc=${countryCode}` : ''}`;
    }
  }
  return url || "https://example.com";
};
```

## 🎁 Avantages

### 1. **Résultats Plus Pertinents**
- ✅ Sites locaux priorisés (.fr, .de, .co.uk, etc.)
- ✅ Langue du pays ciblé
- ✅ Devises locales
- ✅ Actualités locales

### 2. **Meilleur SEO**
- ✅ Tracking de positions géo-localisées précis
- ✅ Résultats correspondant à votre audience cible
- ✅ Comparaison de classements internationaux

### 3. **Expérience Utilisateur**
- ✅ Aperçu en temps réel de l'URL générée
- ✅ Domaine automatiquement adapté au pays
- ✅ Exemples de code corrects

### 4. **Conformité Zyte**
- ✅ Combine domaine local + geolocation Zyte
- ✅ Optimise le taux de succès
- ✅ Réduit les risques de blocage

## 📝 Notes Importantes

### Google.cn (Chine)
⚠️ Google est bloqué en Chine continentale. Les requêtes vers `google.cn` peuvent échouer. Utilisez plutôt Bing ou un moteur de recherche chinois local.

### Redirections Automatiques
Certains domaines Google peuvent rediriger automatiquement selon la localisation de l'IP Zyte. C'est normal et attendu.

### Paramètre Geolocation
Le paramètre `geolocation` de Zyte est **toujours envoyé** en plus du domaine local pour maximiser la précision des résultats.

## 🧪 Tests de Validation

### Test 1 : Domaine Français
```bash
curl -X POST "http://localhost:3009/api/extract" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.fr/search?q=restaurants+paris",
    "type": "serp",
    "country": "FR"
  }'
```

**Résultat attendu** : Sites français (.fr) en première page

---

### Test 2 : Domaine Britannique
```bash
curl -X POST "http://localhost:3009/api/extract" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.co.uk/search?q=best+mobile+phones",
    "type": "serp",
    "country": "GB"
  }'
```

**Résultat attendu** : Sites britanniques (.co.uk) en première page

---

### Test 3 : Bing avec Country Code
```bash
curl -X POST "http://localhost:3009/api/extract" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.bing.com/search?q=actualit%C3%A9s&cc=FR",
    "type": "serp",
    "country": "FR"
  }'
```

**Résultat attendu** : Actualités françaises

## 📈 Impact sur les Résultats

### Avant (google.com pour tout le monde)

```json
{
  "organicResults": [
    {
      "name": "Buy iPhone - Apple (US)",
      "url": "https://www.apple.com/iphone/",
      "description": "Shop iPhone in US..."
    }
  ]
}
```

### Après (google.fr pour la France)

```json
{
  "organicResults": [
    {
      "name": "Acheter iPhone - Apple (FR)",
      "url": "https://www.apple.com/fr/iphone/",
      "description": "Acheter l'iPhone en France..."
    }
  ]
}
```

## 🎯 Cas d'Usage

### 1. **Monitoring SEO International**
Suivez vos positions sur chaque Google local :
```javascript
const countries = ['FR', 'DE', 'ES', 'IT', 'GB'];

for (const country of countries) {
  const results = await extractSERP({
    query: "your product",
    country: country,
    engine: 'google'
  });
  
  console.log(`Position in ${country}:`, results.rank);
}
```

### 2. **Analyse de Concurrence Locale**
Comparez la concurrence par pays :
```javascript
const competitors = await extractSERP({
  query: "best running shoes",
  country: "GB",
  engine: 'google'
});

console.log("UK competitors:", competitors.organicResults);
```

### 3. **Recherche Multilingue**
Testez des requêtes dans différentes langues :
```javascript
// Recherche en japonais sur Google Japon
const jpResults = await extractSERP({
  query: "最高のスマートフォン",
  country: "JP",
  engine: 'google'
});
```

## 🔗 Références

- [Liste des domaines Google](https://en.wikipedia.org/wiki/List_of_Google_domains)
- [Bing Market Codes](https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/reference/market-codes)
- [Zyte Geolocation Docs](https://docs.zyte.com/zyte-api/usage/reference.html#geolocation)

---

**Date** : Octobre 2025  
**Version** : 1.2.0  
**Auteur** : Équipe Fetchify

