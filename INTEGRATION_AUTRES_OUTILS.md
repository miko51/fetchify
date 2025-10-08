# 🔧 Intégration d'autres outils de documentation API

Ce guide vous montre comment intégrer d'autres outils populaires de documentation API si vous souhaitez des fonctionnalités supplémentaires.

---

## 1. 📘 Swagger UI (Documentation auto-générée)

### Pourquoi ?
- Interface "Try it out" native
- Génération automatique depuis OpenAPI
- Standard de l'industrie

### Installation

```bash
npm install swagger-ui-react
```

### Création de la page

**Fichier :** `app/[locale]/swagger/page.tsx`

```tsx
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <SwaggerUI url="/openapi.json" />
      </div>
    </div>
  );
}
```

### Personnalisation du style

Créez `app/[locale]/swagger/swagger-dark.css` :

```css
/* Custom dark theme for Swagger UI */
.swagger-ui {
  filter: invert(88%) hue-rotate(180deg);
}

.swagger-ui .microlight {
  filter: invert(100%) hue-rotate(180deg);
}
```

### Accès
- Local : http://localhost:3005/fr/swagger
- Production : https://fetchify.app/fr/swagger

---

## 2. 📙 Redoc (Design élégant)

### Pourquoi ?
- Design ultra-propre et lisible
- Navigation fluide
- Search intégrée

### Installation

```bash
npm install redoc
npm install mobx # dépendance requise
```

### Création de la page

**Fichier :** `app/[locale]/redoc/page.tsx`

```tsx
"use client";

import { RedocStandalone } from 'redoc';

export default function RedocPage() {
  return (
    <div className="min-h-screen">
      <RedocStandalone
        specUrl="/openapi.json"
        options={{
          theme: {
            colors: {
              primary: {
                main: '#3b82f6' // Bleu Fetchify
              }
            },
            typography: {
              fontSize: '16px',
              fontFamily: 'system-ui, sans-serif'
            },
            sidebar: {
              backgroundColor: '#0f172a',
              textColor: '#e2e8f0'
            }
          },
          scrollYOffset: 80,
          hideDownloadButton: false,
          disableSearch: false,
          expandResponses: "200,201",
        }}
      />
    </div>
  );
}
```

### Accès
- Local : http://localhost:3005/fr/redoc
- Production : https://fetchify.app/fr/redoc

---

## 3. 📕 Docusaurus (Site complet)

### Pourquoi ?
- Site de documentation complet
- Blog intégré
- Versioning
- Search Algolia

### Installation

```bash
npx create-docusaurus@latest docs classic --typescript
cd docs
npm start
```

### Structure recommandée

```
fetchify/
├── app/                  # Votre app Next.js
└── docs/                 # Site Docusaurus séparé
    ├── docs/
    │   ├── intro.md
    │   ├── api/
    │   │   ├── authentication.md
    │   │   ├── endpoints.md
    │   │   └── errors.md
    │   └── guides/
    │       ├── quickstart.md
    │       └── examples.md
    ├── blog/
    │   └── 2025-01-01-welcome.md
    └── docusaurus.config.js
```

### Configuration

**Fichier :** `docs/docusaurus.config.js`

```js
module.exports = {
  title: 'Fetchify Documentation',
  tagline: 'API d\'extraction de données produits',
  url: 'https://docs.fetchify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'Fetchify',
      logo: {
        alt: 'Fetchify Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Documentation',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://fetchify.app',
          label: 'Dashboard',
          position: 'right',
        },
      ],
    },
  },
  
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
```

### Déploiement

Option 1 : Sous-domaine séparé
- docs.fetchify.app → Docusaurus
- fetchify.app → Next.js app

Option 2 : Dossier /docs
- fetchify.app/docs → Proxy vers Docusaurus

---

## 4. 🎯 Mintlify (SaaS moderne)

### Pourquoi ?
- Hébergement inclus
- Analytics intégrés
- Éditeur visuel

### Installation

```bash
npm i -g mintlify
mintlify init
```

### Configuration

**Fichier :** `mint.json`

```json
{
  "name": "Fetchify",
  "logo": {
    "light": "/logo/light.svg",
    "dark": "/logo/dark.svg"
  },
  "favicon": "/favicon.png",
  "colors": {
    "primary": "#3b82f6",
    "light": "#8b5cf6",
    "dark": "#1e40af"
  },
  "topbarCtaButton": {
    "name": "Dashboard",
    "url": "https://fetchify.app/dashboard"
  },
  "navigation": [
    {
      "group": "Get Started",
      "pages": ["introduction", "quickstart"]
    },
    {
      "group": "API Reference",
      "pages": [
        "api-reference/authentication",
        "api-reference/fetch-product",
        "api-reference/check-credits"
      ]
    }
  ]
}
```

### Déploiement

```bash
mintlify deploy
```

---

## 5. 📗 Postman Collection

### Pourquoi ?
- Partage facile avec les développeurs
- Import direct dans Postman
- Tests automatiques

### Génération depuis OpenAPI

1. Allez sur https://www.postman.com/
2. Import → Link → `https://fetchify.app/openapi.json`
3. Export → Collection v2.1
4. Hébergez sur `public/postman-collection.json`

### Bouton "Run in Postman"

Ajoutez dans votre documentation :

```tsx
<a 
  href="https://www.postman.com/api-network/?ctx=docs"
  target="_blank"
  className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all"
>
  <img src="/postman-icon.svg" className="w-5 h-5 mr-2" />
  Run in Postman
</a>
```

---

## 6. 🔍 Ajout d'une Search Bar

### Option A : Algolia DocSearch (Gratuit pour open-source)

```bash
npm install @docsearch/react
```

```tsx
import { DocSearch } from '@docsearch/react';

<DocSearch
  appId="YOUR_APP_ID"
  indexName="fetchify"
  apiKey="YOUR_SEARCH_API_KEY"
/>
```

### Option B : Search locale simple

```tsx
import { useState } from 'react';

export function SimpleSearch() {
  const [query, setQuery] = useState('');
  
  const sections = [
    { title: 'Introduction', path: '#introduction' },
    { title: 'Authentication', path: '#authentication' },
    // ...
  ];
  
  const filtered = sections.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documentation..."
      />
      {filtered.map(item => (
        <a href={item.path}>{item.title}</a>
      ))}
    </div>
  );
}
```

---

## 7. 📊 Analytics pour votre documentation

### Vercel Analytics

Déjà inclus si vous utilisez Vercel.

```tsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Google Analytics

```bash
npm install @next/third-parties
```

```tsx
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

### Plausible (Privacy-friendly)

```tsx
<script defer data-domain="fetchify.app" src="https://plausible.io/js/script.js"></script>
```

---

## 8. 🎨 Personnalisation avancée

### Thème personnalisé pour Prism

**Fichier :** `lib/prism-theme.ts`

```ts
export const fetchifyTheme = {
  'code[class*="language-"]': {
    color: '#e2e8f0',
    background: '#0f172a',
    fontFamily: 'Fira Code, monospace',
  },
  'token.comment': {
    color: '#64748b',
    fontStyle: 'italic',
  },
  'token.keyword': {
    color: '#818cf8',
  },
  'token.string': {
    color: '#34d399',
  },
  // ... plus de customisation
};
```

### Interactive Code Editor

```bash
npm install @uiw/react-codemirror
```

```tsx
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

<CodeMirror
  value={code}
  height="200px"
  extensions={[javascript()]}
  onChange={(value) => setCode(value)}
  theme="dark"
/>
```

---

## 9. 🚀 SDK Generator

### OpenAPI Generator

Générez des SDKs automatiquement :

```bash
npm install @openapitools/openapi-generator-cli -g

# JavaScript/TypeScript
openapi-generator-cli generate \
  -i public/openapi.json \
  -g typescript-fetch \
  -o sdk/typescript

# Python
openapi-generator-cli generate \
  -i public/openapi.json \
  -g python \
  -o sdk/python

# PHP
openapi-generator-cli generate \
  -i public/openapi.json \
  -g php \
  -o sdk/php
```

---

## 10. 📝 Changelog automatique

### Utiliser Changesets

```bash
npm install @changesets/cli
npx changeset init
```

**Fichier :** `.changeset/config.json`

```json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "linked": [],
  "access": "public"
}
```

Ajoutez une page changelog :

```tsx
// app/[locale]/changelog/page.tsx
export default function ChangelogPage() {
  return (
    <div>
      <h1>Changelog</h1>
      
      <article>
        <h2>v1.2.0 - 2025-10-08</h2>
        <ul>
          <li>✨ Added image extraction</li>
          <li>🐛 Fixed price parsing</li>
        </ul>
      </article>
      
      <article>
        <h2>v1.1.0 - 2025-09-15</h2>
        <ul>
          <li>✨ Added multi-currency support</li>
        </ul>
      </article>
    </div>
  );
}
```

---

## 📚 Comparaison finale

| Besoin | Outil recommandé |
|--------|------------------|
| Doc simple et rapide | **react-syntax-highlighter** (✅ actuel) |
| Interface "Try it out" | Swagger UI |
| Design ultra-propre | Redoc |
| Site complet avec blog | Docusaurus |
| Hébergement clé en main | Mintlify |
| Tests API | Postman Collection |
| Search puissante | Algolia DocSearch |
| SDKs auto-générés | OpenAPI Generator |

---

## ✅ Recommandation

Pour **Fetchify**, votre setup actuel (`react-syntax-highlighter` + page custom) est **idéal** car :

✅ Contrôle total du design  
✅ Cohérent avec le reste du site  
✅ Léger et rapide  
✅ Facile à maintenir  
✅ Playground interactif custom  

**N'ajoutez d'autres outils que si vous avez des besoins spécifiques :**
- Blog technique → Docusaurus
- UI "Try it out" auto-générée → Swagger UI
- Déléguer l'hébergement → Mintlify

---

**🎯 Votre documentation actuelle est déjà de niveau production !**

