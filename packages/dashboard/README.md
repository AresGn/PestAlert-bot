# 🌾 Dashboard Admin PestAlert

## 📋 Vue d'ensemble

Le Dashboard Admin PestAlert est une interface web moderne permettant aux administrateurs de surveiller et gérer le système PestAlert en temps réel. Il fournit des métriques détaillées, des visualisations et des outils de gestion pour optimiser l'efficacité du bot WhatsApp.

## 🎯 Objectifs

- **Monitoring en temps réel** : Surveillance de l'activité du bot et des services
- **Analyse des données** : Visualisation des tendances d'utilisation et des performances
- **Gestion des alertes** : Interface pour traiter les alertes des agriculteurs
- **Métriques KPI** : Suivi des indicateurs clés de performance
- **Administration** : Gestion des utilisateurs et configuration du système

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Charts** : Chart.js + React-Chartjs-2 + Recharts
- **State Management** : React Query (@tanstack/react-query)
- **Routing** : React Router DOM
- **Maps** : React Leaflet
- **Real-time** : Socket.io Client
- **HTTP Client** : Axios
- **Forms** : React Hook Form
- **Icons** : Lucide React

### Structure des Données

#### Métriques Collectées
1. **Sessions Utilisateurs**
   - Nombre d'utilisateurs actifs
   - Durée moyenne des sessions
   - Répartition géographique

2. **Analyses d'Images**
   - Nombre total d'analyses
   - Taux de succès/échec
   - Types d'analyses (santé, ravageurs)
   - Temps de traitement moyen

3. **Alertes**
   - Nombre d'alertes par sévérité
   - Temps de réponse moyen
   - Statut des alertes (pending, resolved)

4. **Performance Système**
   - Statut des services (API, Bot, Base de données)
   - Temps de réponse des endpoints
   - Utilisation des ressources

## 📊 Fonctionnalités Principales

### 1. Page d'Aperçu (Dashboard Overview)
- **KPIs en temps réel**
  - Agriculteurs connectés aujourd'hui
  - Analyses effectuées (24h/7j/30j)
  - Alertes actives et résolues
  - Taux de disponibilité des services

- **Graphiques de tendances**
  - Évolution de l'utilisation quotidienne
  - Répartition des types d'analyses
  - Géolocalisation des utilisateurs

### 2. Monitoring en Temps Réel
- **Activité Live**
  - Messages reçus/envoyés en temps réel
  - Analyses en cours
  - Nouvelles alertes

- **Statut des Services**
  - API Backend (vert/rouge)
  - Bot WhatsApp (connecté/déconnecté)
  - Base de données (opérationnelle/erreur)
  - Services OpenEPI (disponible/indisponible)

### 3. Gestion des Alertes
- **Liste des Alertes**
  - Filtrage par sévérité, statut, date
  - Recherche par agriculteur
  - Actions en lot

- **Détails d'Alerte**
  - Informations complètes
  - Images associées
  - Historique des actions
  - Assignation aux agents

### 4. Analytics et Rapports
- **Statistiques d'Usage**
  - Graphiques temporels
  - Répartition géographique
  - Analyses de performance

- **Rapports Exportables**
  - PDF/Excel des métriques
  - Rapports personnalisés
  - Planification automatique

## 🗄️ Base de Données

### Schéma Étendu (Ajouts au schema.prisma existant)

Le dashboard utilise la base de données Prisma existante et ajoute de nouvelles tables pour les métriques et l'authentification.

## 🔧 Configuration et Installation

### Variables d'Environnement
```env
# Dashboard spécifique
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_MAP_API_KEY=your_map_api_key

# Base de données (partagée avec le core)
DATABASE_URL=postgresql://username:password@localhost:5432/pestalert

# JWT pour l'authentification
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

### Scripts de Développement
```bash
# Démarrer le dashboard en mode développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview

# Tests
npm run test
```

## 🚀 Plan de Développement

### Phase 1 : Infrastructure (En cours)
- [x] Configuration de la base de données étendue
- [ ] Services de collecte de données
- [ ] API endpoints pour les métriques
- [ ] Authentification de base

### Phase 2 : Interface Core
- [ ] Page d'aperçu avec KPIs
- [ ] Graphiques et visualisations
- [ ] Navigation et layout
- [ ] Responsive design

### Phase 3 : Fonctionnalités Avancées
- [ ] Monitoring en temps réel
- [ ] Gestion des alertes
- [ ] Système de notifications
- [ ] Filtres et recherche

### Phase 4 : Optimisation
- [ ] Performance et caching
- [ ] Tests complets
- [ ] Documentation
- [ ] Déploiement

## 📈 Métriques Clés à Surveiller

### Utilisation
- **Utilisateurs actifs** : Quotidien, hebdomadaire, mensuel
- **Analyses par jour** : Tendance et pics d'utilisation
- **Taux de rétention** : Utilisateurs qui reviennent

### Performance
- **Temps de réponse** : API, analyses d'images
- **Taux de succès** : Analyses réussies vs échecs
- **Disponibilité** : Uptime des services

### Business
- **Alertes critiques** : Nombre et temps de résolution
- **Satisfaction** : Feedback des agriculteurs
- **Couverture géographique** : Zones d'utilisation

## 🔄 Intégration avec le Bot

### Collecte de Données
Le dashboard collecte automatiquement les données du bot via :
- **Logs structurés** : LoggingService du bot
- **Webhooks** : Événements en temps réel
- **Polling** : Métriques périodiques
- **Base de données partagée** : Accès direct aux données

### Synchronisation
- **Temps réel** : Socket.io pour les updates live
- **Batch processing** : Agrégation des métriques historiques
- **Cache** : Redis pour les données fréquemment consultées

## 🎨 Design System

### Couleurs
- **Primary** : Vert agriculture (#16a34a)
- **Secondary** : Bleu ciel (#0ea5e9)
- **Warning** : Orange (#f59e0b)
- **Danger** : Rouge (#dc2626)
- **Success** : Vert (#10b981)

### Composants
- Cards avec ombres subtiles
- Graphiques avec animations fluides
- Tables responsives avec tri/filtrage
- Modals pour les actions détaillées
- Toast notifications pour le feedback

---

*Ce README sera mis à jour au fur et à mesure du développement du dashboard.*
