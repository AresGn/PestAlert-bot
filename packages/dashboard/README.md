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
  - Assignation automatique/manuelle aux agents

- **Détails d'Alerte**
  - Informations complètes
  - Images associées
  - Historique des actions
  - Géolocalisation de l'alerte
  - Agent assigné et statut d'intervention

### 4. Gestion des Agents de Terrain
- **Liste des Agents**
  - Profils complets des agents
  - Statut en temps réel (disponible, en mission, hors service)
  - Localisation GPS en temps réel
  - Zone de couverture géographique

- **Performances des Agents**
  - Nombre d'interventions effectuées
  - Temps de réponse moyen
  - Taux de résolution des alertes
  - Évaluations des agriculteurs
  - Statistiques par période

- **Assignation Intelligente**
  - Assignation automatique basée sur la proximité
  - Prise en compte de la charge de travail
  - Spécialisation par type de culture/problème
  - Optimisation des trajets

### 5. Gestion des Interventions
- **Workflow Complet**
  - Création automatique lors d'assignation d'alerte
  - Suivi en temps réel du statut
  - Communication agent ↔ agriculteur
  - Validation et clôture d'intervention

- **Suivi en Temps Réel**
  - Position GPS de l'agent en route
  - Temps estimé d'arrivée
  - Notifications automatiques à l'agriculteur
  - Mise à jour du statut en direct

- **Rapports d'Intervention**
  - Rapport détaillé post-intervention
  - Photos avant/après
  - Recommandations et traitements appliqués
  - Suivi des résultats

### 6. Cartographie et Géolocalisation
- **Carte Interactive**
  - Visualisation des alertes géolocalisées
  - Position en temps réel des agents
  - Zones de couverture des agents
  - Clusters d'alertes par région

- **Optimisation Géographique**
  - Calcul des trajets optimaux
  - Répartition équilibrée des zones
  - Analyse de densité des alertes
  - Planification des tournées

### 7. Analytics et Rapports Avancés
- **Statistiques d'Usage**
  - Graphiques temporels
  - Répartition géographique
  - Analyses de performance
  - Métriques par agent et région

- **Analytics des Interventions**
  - Temps de réponse par zone géographique
  - Efficacité des agents par type d'alerte
  - Tendances saisonnières des problèmes
  - Prédictions basées sur l'historique

- **Rapports Exportables**
  - PDF/Excel des métriques
  - Rapports personnalisés par agent/région
  - Planification automatique
  - Tableaux de bord exécutifs

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

### Phase 1 : Infrastructure ✅ TERMINÉE
- [x] Configuration de la base de données étendue
- [x] Services de collecte de données
- [x] API endpoints pour les métriques
- [x] Authentification de base

### Phase 2 : Interface Core ✅ TERMINÉE
- [x] Page d'aperçu avec KPIs
- [x] Graphiques et visualisations
- [x] Navigation et layout
- [x] Responsive design

### Phase 3 : Gestion des Agents 🔄 EN COURS
- [ ] Page "Agents de Terrain" avec liste et détails
- [ ] Statut en temps réel des agents
- [ ] Performances et statistiques des agents
- [ ] Assignation manuelle des alertes aux agents

### Phase 4 : Gestion des Interventions 🔄 EN COURS
- [ ] Workflow complet d'intervention
- [ ] Suivi en temps réel des interventions
- [ ] Rapports d'intervention
- [ ] Communication agent ↔ dashboard

### Phase 5 : Cartographie 🔄 EN COURS
- [ ] Carte interactive avec React Leaflet
- [ ] Géolocalisation des alertes
- [ ] Position des agents en temps réel
- [ ] Optimisation des trajets

### Phase 6 : Fonctionnalités Avancées ⏳ PLANIFIÉE
- [ ] Assignation automatique intelligente
- [ ] Prédictions et analytics avancées
- [ ] Application mobile pour agents
- [ ] Notifications push en temps réel

### Phase 7 : Optimisation ⏳ PLANIFIÉE
- [ ] Performance et caching avancé
- [ ] Tests complets E2E
- [ ] Documentation complète
- [ ] Déploiement production

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

## 🔄 Workflow Alertes → Agents → Interventions

### 1. Détection d'Alerte (Bot WhatsApp)
```
Agriculteur envoie image → Analyse OpenEPI → Détection problème → Création alerte
```

### 2. Assignation d'Agent (Dashboard)
```
Alerte créée → Algorithme d'assignation → Agent le plus proche → Notification agent
```

### 3. Intervention (Terrain)
```
Agent reçoit mission → Se déplace → Arrive chez agriculteur → Effectue intervention → Rapport
```

### 4. Suivi et Clôture (Dashboard)
```
Rapport agent → Validation → Clôture alerte → Feedback agriculteur → Analytics
```

## 🔄 Intégration avec le Bot

### Collecte de Données
Le dashboard collecte automatiquement les données du bot via :
- **Logs structurés** : LoggingService du bot
- **Webhooks** : Événements en temps réel
- **Polling** : Métriques périodiques
- **Base de données partagée** : Accès direct aux données
- **Géolocalisation** : Position des agents et alertes

### Synchronisation
- **Temps réel** : Socket.io pour les updates live
- **Batch processing** : Agrégation des métriques historiques
- **Cache** : Redis pour les données fréquemment consultées
- **Notifications push** : Alertes aux agents mobiles

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
