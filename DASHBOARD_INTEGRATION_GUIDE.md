# 📊 Guide d'Intégration Bot ↔ Dashboard

Ce guide explique comment connecter le bot WhatsApp Railway au dashboard admin pour récupérer les statistiques en temps réel.

## 🏗️ Architecture

```
┌─────────────────────┐    HTTP API    ┌─────────────────────┐    WebSocket    ┌─────────────────────┐
│                     │   ────────────▶│                     │   ────────────▶│                     │
│  Bot WhatsApp       │                │  API Backend        │                │  Dashboard React    │
│  (Railway)          │                │  (packages/api)     │                │  (packages/dashboard)│
│                     │◀────────────── │                     │◀────────────── │                     │
└─────────────────────┘    Auth Token  └─────────────────────┘    Real-time    └─────────────────────┘
```

## 🚀 Configuration Étape par Étape

### 1. Configuration du Bot Railway

#### A. Variables d'environnement
Créez un fichier `.env` dans `pestalert-bot-railway/` :

```env
# Dashboard Integration
DASHBOARD_INTEGRATION_ENABLED=true
DASHBOARD_API_URL=http://localhost:3001
BOT_API_SECRET=your-secure-bot-secret

# OpenEPI (déjà configuré)
OPENEPI_CLIENT_ID=aresgn-testpestsAPI
OPENEPI_CLIENT_SECRET=gHrAAcKkMkvEDfDijdqqBXULbqjGzlyK
```

#### B. Pour le déploiement Railway
Dans Railway, ajoutez ces variables d'environnement :
- `DASHBOARD_INTEGRATION_ENABLED=true`
- `DASHBOARD_API_URL=https://votre-api-backend.com`
- `BOT_API_SECRET=your-secure-bot-secret`

### 2. Configuration de l'API Backend

#### A. Variables d'environnement
Dans `packages/api/.env` :

```env
# Bot Authentication
BOT_API_SECRET=your-secure-bot-secret
JWT_SECRET=your-jwt-secret

# Database
DATABASE_URL=postgresql://...

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### B. Installation des dépendances
```bash
cd packages/api
npm install
```

### 3. Configuration du Dashboard

#### A. Variables d'environnement
Dans `packages/dashboard/.env` :

```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

## 🔧 Démarrage des Services

### 1. Démarrer l'API Backend
```bash
cd packages/api
npm run dev
```
L'API sera disponible sur `http://localhost:3001`

### 2. Démarrer le Dashboard
```bash
cd packages/dashboard
npm run dev
```
Le dashboard sera disponible sur `http://localhost:5173`

### 3. Démarrer le Bot
```bash
cd pestalert-bot-railway
npm run dev
```

## 🧪 Test de la Connexion

Exécutez le script de test :
```bash
node test-dashboard-connection.js
```

Ce script vérifie :
- ✅ Accessibilité de l'API
- ✅ Authentification du bot
- ✅ Envoi de données de session
- ✅ Envoi d'analyses d'images
- ✅ Envoi de métriques système

## 📊 Données Transmises

### 1. Sessions Utilisateur
```json
{
  "userId": "user-123",
  "userPhone": "+33123456789",
  "userName": "John Doe",
  "location": { "lat": 48.8566, "lon": 2.3522 },
  "timestamp": "2024-01-15T10:30:00Z",
  "botSource": "railway"
}
```

### 2. Analyses d'Images
```json
{
  "userId": "user-123",
  "userPhone": "+33123456789",
  "analysisType": "health",
  "success": true,
  "isHealthy": true,
  "confidence": 85,
  "topDisease": "Healthy",
  "processingTime": 2.5,
  "imageQuality": "good",
  "alertLevel": "NORMAL",
  "timestamp": "2024-01-15T10:30:00Z",
  "botSource": "railway"
}
```

### 3. Métriques Système
```json
{
  "service": "bot",
  "metric": "memory_usage",
  "value": 128.5,
  "unit": "MB",
  "timestamp": "2024-01-15T10:30:00Z",
  "botSource": "railway"
}
```

## 📈 Métriques Collectées

### Métriques de Performance
- **Utilisation mémoire** (MB)
- **Temps de fonctionnement** (secondes)
- **Disponibilité** (%)
- **Utilisation CPU** (ms)

### Métriques d'Activité
- **Sessions utilisateur** (count)
- **Analyses réussies/échouées** (count)
- **Temps de traitement** (secondes)
- **Niveau de confiance** (%)

### Métriques Externes
- **Temps de réponse OpenEPI** (ms)
- **Disponibilité OpenEPI** (%)
- **Taux d'erreur** (%)

## 🔍 Monitoring Dashboard

Le dashboard affiche :

### Page Principale
- 👥 **Utilisateurs actifs** (temps réel)
- 📊 **Analyses aujourd'hui/semaine/mois**
- 🚨 **Alertes actives**
- 📈 **Taux de succès**

### Page Analytics
- 📊 **Graphiques d'utilisation**
- 📈 **Tendances de performance**
- 🎯 **Répartition par type d'analyse**
- 📍 **Activité par localisation**

### Page Système
- 🟢 **Statut des services** (Bot, API, DB, OpenEPI)
- ⚡ **Métriques de performance**
- 📊 **Historique des métriques**

## 🚨 Dépannage

### Problème : Bot non authentifié
**Solution :**
1. Vérifiez `BOT_API_SECRET` dans les deux `.env`
2. Redémarrez l'API backend
3. Redémarrez le bot

### Problème : Données non affichées
**Solution :**
1. Vérifiez les logs du bot
2. Vérifiez les logs de l'API
3. Testez avec `node test-dashboard-connection.js`

### Problème : Dashboard vide
**Solution :**
1. Vérifiez `VITE_API_URL` dans le dashboard
2. Vérifiez que l'API est accessible
3. Vérifiez l'authentification dashboard

## 🔐 Sécurité

- ✅ Authentification JWT pour le bot
- ✅ Validation des données entrantes
- ✅ Rate limiting sur l'API
- ✅ CORS configuré
- ✅ Secrets sécurisés

## 📝 Logs

### Bot Railway
```
📊 ✅ Dashboard integration activée
📊 ✅ Session utilisateur envoyée: +33123456789
📊 ✅ Analyse envoyée: health - +33123456789
📊 ✅ Métriques de performance envoyées
```

### API Backend
```
✅ Bot authentifié auprès du dashboard API
✅ Session utilisateur enregistrée: +33123456789
✅ Analyse d'image enregistrée: health - +33123456789
✅ Métrique système enregistrée: bot.memory_usage
```

## 🎯 Prochaines Étapes

1. **Déploiement Production** : Configurer les URLs de production
2. **Alertes Temps Réel** : WebSocket pour notifications instantanées
3. **Rapports Automatiques** : Génération de rapports périodiques
4. **Géolocalisation** : Cartes interactives des activités
5. **API Analytics** : Endpoints avancés pour analyses détaillées
