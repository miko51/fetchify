# 📊 Graphique de Consommation - Documentation

## ✨ Nouvelle Fonctionnalité

Un **graphique interactif de consommation** a été ajouté au dashboard pour visualiser l'utilisation de votre API dans le temps avec des filtres de dates personnalisables !

---

## 🎯 Fonctionnalités

### 1. **Graphique en aires (Area Chart)**
- **Double courbe** : Crédits et Appels API
- **Gradients** : Violet pour les crédits, Bleu pour les appels
- **Animations** fluides au survol
- **Responsive** : S'adapte à tous les écrans

### 2. **Filtres de Dates**
- **Sélecteurs de dates** : Date de début et date de fin
- **Boutons rapides** :
  - 7 derniers jours
  - 30 derniers jours  
  - 90 derniers jours
- **Période par défaut** : 30 derniers jours

### 3. **Statistiques de la Période**
Affichage des totaux pour la période sélectionnée :
- 📊 **Total Crédits** utilisés
- 📞 **Total Appels** effectués
- ✅ **Succès** (appels réussis)
- ❌ **Échecs** (appels échoués)

### 4. **État Vide**
Message informatif quand aucune donnée n'est disponible

---

## 📁 Fichiers Créés/Modifiés

### 1. **`app/api/usage/stats/route.ts`** (NOUVEAU)
API route qui récupère et agrège les données de consommation.

#### Endpoint
```
GET /api/usage/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

#### Paramètres Query
- `startDate` (optionnel) : Date de début (format ISO)
- `endDate` (optionnel) : Date de fin (format ISO)

#### Réponse
```json
{
  "data": [
    {
      "date": "2025-01-15",
      "credits": 25,
      "calls": 25,
      "success": 23,
      "failed": 2
    }
  ],
  "totals": {
    "credits": 150,
    "calls": 150,
    "success": 145,
    "failed": 5
  },
  "period": {
    "start": "2025-01-01T00:00:00.000Z",
    "end": "2025-01-31T23:59:59.999Z"
  }
}
```

#### Logique
1. Authentification de l'utilisateur via NextAuth
2. Récupération de tous les `ApiUsage` dans la période
3. Agrégation par jour (date ISO)
4. Calcul des totaux
5. Retour des données triées par date

---

### 2. **`app/dashboard/page.tsx`** (MODIFIÉ)
Dashboard principal avec le nouveau graphique.

#### Nouvelles Dépendances
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
```

#### Nouveaux États
```typescript
const [usageStats, setUsageStats] = useState<UsageStatsData | null>(null);
const [loadingStats, setLoadingStats] = useState(false);
const [startDate, setStartDate] = useState<string>(format(subDays(new Date(), 30), "yyyy-MM-dd"));
const [endDate, setEndDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
```

#### Nouvelles Fonctions
```typescript
// Récupère les statistiques d'utilisation
const fetchUsageStats = async () => { ... }

// Définit rapidement une période (7, 30, 90 jours)
const setQuickPeriod = (days: number) => { ... }
```

#### Hooks useEffect
```typescript
// Charge les stats au montage
useEffect(() => {
  fetchDashboardData();
  fetchUsageStats();
}, []);

// Recharge les stats quand les dates changent
useEffect(() => {
  fetchUsageStats();
}, [startDate, endDate]);
```

---

### 3. **`package.json`** (MODIFIÉ)
Ajout des nouvelles dépendances :

```json
{
  "dependencies": {
    "recharts": "^2.10.3",
    "date-fns": "^3.0.6"
  }
}
```

#### Recharts
- Bibliothèque de graphiques React basée sur D3.js
- Composants réutilisables et personnalisables
- Animations fluides
- Responsive natif

#### date-fns
- Manipulation de dates moderne (alternative à moment.js)
- Modulaire et léger
- Support de l'internationalisation (locale FR)
- Format des dates pour l'affichage

---

## 🎨 Design

### Couleurs du Graphique
```css
/* Gradient Crédits (Violet) */
#colorCredits: linear-gradient(#8b5cf6 5%, transparent 95%)

/* Gradient Appels (Bleu) */
#colorCalls: linear-gradient(#3b82f6 5%, transparent 95%)

/* Grille */
stroke: #334155 (slate-700)
opacity: 0.3

/* Axes */
stroke: #64748b (slate-500)
font-size: 12px
```

### Tooltip Personnalisé
```css
background: #1e293b (slate-800)
border: 1px solid #334155 (slate-700)
border-radius: 12px
padding: 12px
```

### Statistiques de Période
- **Bleu** : Total Crédits
- **Violet** : Total Appels
- **Vert émeraude** : Succès
- **Rouge** : Échecs

---

## 🚀 Utilisation

### Pour l'Utilisateur

1. **Accéder au Dashboard**
   - Aller sur `/dashboard`
   - Le graphique se charge automatiquement avec les 30 derniers jours

2. **Choisir une Période Rapide**
   - Cliquer sur "7 jours", "30 jours" ou "90 jours"
   - Le graphique se met à jour automatiquement

3. **Personnaliser la Période**
   - Sélectionner une "Date de début"
   - Sélectionner une "Date de fin"
   - Le graphique se recharge automatiquement

4. **Analyser les Données**
   - Voir les courbes de crédits (violet) et d'appels (bleu)
   - Consulter les totaux de la période
   - Survoler le graphique pour voir les détails d'un jour

---

## 🔧 Configuration Technique

### Base de Données
Utilise la table `api_usage` existante :
```prisma
model ApiUsage {
  id            String   @id @default(cuid())
  userId        String
  apiKeyId      String
  endpoint      String
  requestUrl    String
  response      String?
  success       Boolean
  errorMessage  String?
  creditsUsed   Int
  createdAt     DateTime @default(now())
  // ...
}
```

### Agrégation
Les données sont agrégées **côté serveur** (API route) pour :
- ✅ Meilleure performance
- ✅ Moins de données transférées
- ✅ Calculs optimisés
- ✅ Sécurité (l'utilisateur ne voit que ses propres données)

### Performance
- **Lazy loading** : Le graphique se charge après le reste du dashboard
- **Loading state** : Spinner élégant pendant le chargement
- **Debouncing** : Les changements de dates déclenchent un seul appel API
- **Caching** : Les données sont mises en cache dans l'état React

---

## 📈 Évolutions Futures Possibles

### Court terme
- [ ] Exporter les données en CSV/Excel
- [ ] Choisir l'affichage (jour/semaine/mois)
- [ ] Ajouter des filtres par clé API
- [ ] Comparer deux périodes

### Moyen terme
- [ ] Graphiques supplémentaires (camembert, barres)
- [ ] Prédictions de consommation (ML)
- [ ] Alertes de consommation anormale
- [ ] Statistiques par endpoint

### Long terme
- [ ] Dashboard temps réel (WebSockets)
- [ ] Analyse avancée (patterns, tendances)
- [ ] Rapports automatiques par email
- [ ] API publique pour les stats

---

## 🐛 Dépannage

### Le graphique ne s'affiche pas
1. Vérifier que Recharts est installé : `npm list recharts`
2. Vérifier la console pour les erreurs
3. S'assurer qu'il y a des données dans la période

### Les dates ne fonctionnent pas
1. Vérifier le format des dates (YYYY-MM-DD)
2. S'assurer que startDate < endDate
3. Regarder les logs serveur pour les erreurs d'API

### Données incorrectes
1. Vérifier l'API : `GET /api/usage/stats?startDate=...&endDate=...`
2. Vérifier les données dans la base : `npx prisma studio`
3. Vérifier le fuseau horaire (UTC utilisé)

---

## 🎉 Résultat

Votre dashboard dispose maintenant d'un **graphique de consommation professionnel** qui permet de :
- ✅ Visualiser l'utilisation dans le temps
- ✅ Analyser les tendances
- ✅ Identifier les pics de consommation
- ✅ Comprendre les patterns d'utilisation
- ✅ Prendre des décisions éclairées sur l'achat de crédits

**Profitez de vos nouvelles analytics ! 📊🚀**

