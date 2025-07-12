# 🔐 Variables d'Environnement - PestAlert

## 📋 Vue d'Ensemble

Ce document décrit toutes les variables d'environnement utilisées dans le projet PestAlert. Le projet utilise un système de configuration centralisé avec le fichier `.env_global` qui alimente tous les packages.

## 🏗️ Architecture de Configuration

```
.env_global                 # Configuration centralisée
├── packages/core/.env      # Variables pour le package Core
├── packages/api/.env       # Variables pour l'API Backend
├── packages/bot/.env       # Variables pour le Bot WhatsApp
├── packages/dashboard/.env # Variables pour le Dashboard
└── apps/web/.env          # Variables pour le Site Web
```

## 🔧 Configuration Automatique

### Script de Configuration
```bash
# Configurer automatiquement tous les .env
node configure-env.js

# Vérifier la configuration
node configure-env.js --check

# Forcer la reconfiguration
node configure-env.js --force
```

### Scripts npm
```bash
npm run setup        # Configuration automatique
npm run setup:check  # Vérification
npm run setup:force  # Force la reconfiguration
```

## 📝 Variables par Catégorie

### 🗄️ Base de Données

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://user:pass@localhost:5432/pestalert` | ✅ |
| `TEST_DATABASE_URL` | Base de données pour les tests | `postgresql://user:pass@localhost:5432/pestalert_test` | ❌ |
| `PRISMA_GENERATE_DATAPROXY` | Utiliser Prisma Data Proxy | `false` | ❌ |

### 🔑 OpenEPI API

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `OPENEPI_BASE_URL` | URL de base de l'API OpenEPI | `https://api.openepi.io` | ✅ |
| `OPENEPI_AUTH_URL` | URL d'authentification OpenEPI | `https://auth.openepi.io/realms/openepi/protocol/openid-connect/token` | ✅ |
| `OPENEPI_CLIENT_ID` | ID client OpenEPI | `aresgn-testpestsAPI` | ✅ |
| `OPENEPI_CLIENT_SECRET` | Secret client OpenEPI | `gHrAAcKkMkvEDfDijdqqBXULbqjGzlyK` | ✅ |
| `OPENEPI_TIMEOUT` | Timeout des requêtes (ms) | `30000` | ❌ |

### 🔒 Sécurité

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `JWT_SECRET` | Clé secrète pour JWT | `your_super_secret_jwt_key_here` | ✅ |
| `JWT_EXPIRES_IN` | Durée de validité JWT | `24h` | ❌ |
| `JWT_REFRESH_EXPIRES_IN` | Durée refresh token | `7d` | ❌ |
| `BCRYPT_ROUNDS` | Rounds pour bcrypt | `12` | ❌ |
| `SESSION_SECRET` | Secret pour les sessions | `your_session_secret` | ❌ |

### 📱 WhatsApp

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `WHATSAPP_SESSION_PATH` | Chemin des sessions WhatsApp | `./sessions` | ✅ |
| `WHATSAPP_SESSION_SECRET` | Secret pour les sessions | `your_whatsapp_secret` | ❌ |
| `WHATSAPP_HEADLESS` | Mode headless pour Puppeteer | `true` | ❌ |
| `WHATSAPP_ALLOWED_NUMBERS` | Numéros autorisés (CSV) | `+33123456789,+33987654321` | ❌ |

### 🌐 Serveurs et Ports

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `API_PORT` | Port de l'API Backend | `3001` | ❌ |
| `API_HOST` | Host de l'API | `localhost` | ❌ |
| `API_BASE_URL` | URL complète de l'API | `http://localhost:3001` | ✅ |
| `DASHBOARD_PORT` | Port du Dashboard | `5173` | ❌ |
| `WEB_PORT` | Port du Site Web | `5174` | ❌ |
| `SOCKET_PORT` | Port WebSocket | `3001` | ❌ |

### 🗺️ Cartes et Géolocalisation

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `MAP_API_KEY` | Clé API pour les cartes | `your_map_api_key` | ❌ |
| `MAP_DEFAULT_CENTER_LAT` | Latitude par défaut | `6.1319` | ❌ |
| `MAP_DEFAULT_CENTER_LNG` | Longitude par défaut | `1.2228` | ❌ |
| `MAP_DEFAULT_ZOOM` | Zoom par défaut | `8` | ❌ |

### 📧 Notifications

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` | ❌ |
| `SMTP_PORT` | Port SMTP | `587` | ❌ |
| `SMTP_USER` | Utilisateur SMTP | `your-email@gmail.com` | ❌ |
| `SMTP_PASS` | Mot de passe SMTP | `your-app-password` | ❌ |
| `ALERT_NOTIFICATION_WEBHOOK` | Webhook pour alertes | `https://webhook.com/alerts` | ❌ |
| `EMERGENCY_PHONE` | Téléphone d'urgence | `+33123456789` | ❌ |
| `EMERGENCY_EMAIL` | Email d'urgence | `urgence@pestalert.com` | ❌ |

### 🗄️ Cache (Redis)

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `REDIS_URL` | URL de connexion Redis | `redis://localhost:6379` | ❌ |
| `REDIS_PASSWORD` | Mot de passe Redis | `your_redis_password` | ❌ |
| `REDIS_DB` | Numéro de base Redis | `0` | ❌ |
| `CACHE_TTL` | TTL du cache (secondes) | `3600` | ❌ |

### 📊 Logging et Monitoring

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `LOG_LEVEL` | Niveau de logging | `info` | ❌ |
| `LOG_FORMAT` | Format des logs | `combined` | ❌ |
| `LOG_RETENTION_DAYS` | Rétention des logs | `90` | ❌ |
| `METRICS_COLLECTION_INTERVAL` | Intervalle métriques (ms) | `300000` | ❌ |
| `ENABLE_METRICS` | Activer les métriques | `true` | ❌ |

### 🔧 Environnement

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `NODE_ENV` | Environnement Node.js | `development` | ✅ |
| `DEBUG` | Mode debug | `true` | ❌ |
| `VERBOSE` | Logging verbeux | `false` | ❌ |

### 📱 Frontend (Vite)

| Variable | Description | Exemple | Requis |
|----------|-------------|---------|--------|
| `VITE_API_URL` | URL de l'API pour le frontend | `http://localhost:3001` | ✅ |
| `VITE_SOCKET_URL` | URL WebSocket pour le frontend | `http://localhost:3001` | ❌ |
| `VITE_MAP_API_KEY` | Clé API cartes pour le frontend | `your_map_api_key` | ❌ |
| `VITE_APP_NAME` | Nom de l'application | `PestAlert` | ❌ |
| `VITE_APP_VERSION` | Version de l'application | `1.0.0` | ❌ |
| `VITE_APP_ENV` | Environnement frontend | `development` | ❌ |

## 📦 Variables par Package

### 🔧 Core (`packages/core`)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
JWT_EXPIRES_IN="24h"
REDIS_URL="redis://localhost:6379"
LOG_LEVEL="info"
METRICS_COLLECTION_INTERVAL="300000"
```

### 🌐 API (`packages/api`)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret"
PORT="3001"
NODE_ENV="development"
REDIS_URL="redis://localhost:6379"
CORS_ORIGIN="http://localhost:5173"
```

### 🤖 Bot (`packages/bot`)
```env
WHATSAPP_SESSION_PATH="./sessions"
OPENEPI_BASE_URL="https://api.openepi.io"
OPENEPI_CLIENT_ID="aresgn-testpestsAPI"
OPENEPI_CLIENT_SECRET="gHrAAcKkMkvEDfDijdqqBXULbqjGzlyK"
LOG_LEVEL="info"
NODE_ENV="development"
```

### 📊 Dashboard (`packages/dashboard`)
```env
VITE_API_URL="http://localhost:3001"
VITE_SOCKET_URL="http://localhost:3001"
VITE_MAP_API_KEY="your_map_api_key"
VITE_APP_ENV="development"
VITE_APP_NAME="PestAlert Dashboard"
```

### 🌍 Web (`apps/web`)
```env
VITE_API_URL="http://localhost:3001"
VITE_APP_ENV="development"
VITE_APP_NAME="PestAlert"
```

## 🔒 Sécurité et Bonnes Pratiques

### ⚠️ Variables Sensibles
Ces variables contiennent des informations sensibles et ne doivent JAMAIS être commitées :
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENEPI_CLIENT_SECRET`
- `SMTP_PASS`
- `REDIS_PASSWORD`

### 🛡️ Génération de Secrets
```bash
# Générer un JWT secret fort
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Générer un secret de session
openssl rand -hex 32
```

### 🔐 Production
En production, utilisez :
- **Variables d'environnement système** plutôt que des fichiers .env
- **Gestionnaires de secrets** (AWS Secrets Manager, Azure Key Vault, etc.)
- **Chiffrement** pour les données sensibles
- **Rotation régulière** des secrets

## 🚨 Dépannage

### Problème: Variables non trouvées
```bash
# Vérifier la configuration
node configure-env.js --check

# Reconfigurer
node configure-env.js --force
```

### Problème: Fichier .env_global manquant
```bash
# Copier l'exemple
cp .env_global.example .env_global

# Éditer avec vos valeurs
notepad .env_global  # Windows
nano .env_global     # Linux/Mac
```

### Problème: Variables non synchronisées
```bash
# Nettoyer les .env existants
npm run clean:env

# Reconfigurer
npm run setup
```

---

## 📚 Ressources

- **[Guide de Démarrage Rapide](./QUICK_START.md)**
- **[README Principal](./README.md)**
- **[Configuration OpenEPI](./packages/bot/README_OPENEPI_INTEGRATION.md)**
