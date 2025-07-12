# 🌾 PestAlert - Système d'Alerte Précoce pour Ravageurs

## 📋 Description

PestAlert est un système d'alerte précoce qui utilise l'intelligence artificielle et les données satellites pour détecter et prévenir les attaques de ravageurs (notamment les chenilles légionnaires) sur les cultures agricoles au Togo. La solution combine les APIs OpenEPI existantes avec une interface WhatsApp accessible aux agriculteurs.

## 🏗️ Architecture Monorepo

```
pestalert-bot/
├── packages/
│   ├── core/                    # Logique métier partagée + Prisma ORM
│   ├── api/                     # API Backend (Express + TypeScript)
│   ├── bot/                     # Bot WhatsApp (WhatsApp Web.js)
│   ├── dashboard/               # Dashboard Admin (React + Vite)
│   ├── mobile/                  # Interface mobile (React Native) [À venir]
│   └── shared/                  # Composants et utils partagés [À venir]
├── apps/
│   ├── web/                     # Application web publique (React + Vite)
│   └── admin/                   # Dashboard d'administration [À venir]
├── tools/
│   ├── scripts/                 # Scripts de déploiement [À venir]
│   └── config/                  # Configuration partagée [À venir]
└── docs/                        # Documentation
```

## 🚀 Installation Complète

### 📋 Prérequis Système

#### Obligatoires
- **Node.js v18+** (recommandé: v20 LTS)
- **npm v8+** ou **yarn v1.22+**
- **PostgreSQL 14+** (local ou cloud comme Neon)
- **Git** pour le clonage du repository

#### Optionnels
- **Redis** (pour le cache et les sessions)
- **Chrome/Chromium** (pour WhatsApp Web.js)
- **Docker** (pour le déploiement)

### 🔧 Installation Étape par Étape

#### 1. Cloner le Repository
```bash
git clone <repository-url>
cd pestalert-bot
```

#### 2. Configuration Globale des Variables d'Environnement
```bash
# Copier le fichier de configuration global
cp .env_global.example .env_global

# Éditer le fichier avec vos paramètres
# Voir la section "Variables d'Environnement" ci-dessous
```

#### 3. Installation des Dépendances
```bash
# Installation globale (racine du monorepo)
npm install

# Installation pour chaque package (automatique avec workspaces)
# Mais vous pouvez aussi installer manuellement :
cd packages/core && npm install
cd ../api && npm install
cd ../bot && npm install
cd ../dashboard && npm install
cd ../../apps/web && npm install
```

#### 4. Configuration de la Base de Données
```bash
# Aller dans le package core
cd packages/core

# Copier et configurer l'environnement
cp .env.example .env
# Éditer .env avec votre DATABASE_URL

# Générer le client Prisma
npm run db:generate

# Exécuter les migrations
npm run db:migrate

# Initialiser avec des données de test (optionnel)
npm run db:init
```

#### 5. Configuration de Chaque Package

##### 📦 Core (packages/core)
```bash
cd packages/core
cp .env.example .env
# Configurer DATABASE_URL et JWT_SECRET
```

##### 🌐 API (packages/api)
```bash
cd packages/api
cp .env.example .env
# Configurer PORT, DATABASE_URL, JWT_SECRET
```

##### 🤖 Bot (packages/bot)
```bash
cd packages/bot
cp .env.example .env
# Configurer OPENEPI_CLIENT_ID, OPENEPI_CLIENT_SECRET, WHATSAPP_SESSION_PATH
```

##### 📊 Dashboard (packages/dashboard)
```bash
cd packages/dashboard
cp .env.example .env
# Configurer VITE_API_URL, VITE_SOCKET_URL
```

##### 🌍 Web (apps/web)
```bash
cd apps/web
cp .env.example .env
# Configurer VITE_API_URL
```

### 🚀 Démarrage des Services

#### Option 1: Démarrage Automatique (Recommandé)
```bash
# Démarrer tous les services en une fois
start_all.bat

# Ou sur Linux/Mac
npm run dev
```

#### Option 2: Démarrage Manuel
```bash
# 1. API Backend (port 3001)
start_api.bat
# ou: cd packages/api && npm run dev

# 2. Dashboard Admin (port 5173)
start_dashboard.bat
# ou: cd packages/dashboard && npm run dev

# 3. Site Web Public (port 5174)
start_web.bat
# ou: cd apps/web && npm run dev

# 4. Bot WhatsApp
start_bot.bat
# ou: cd packages/bot && npm run dev
```

## 🌐 URLs de Développement

- **API Backend**: http://localhost:3001
- **Dashboard Admin**: http://localhost:5173
- **Site Web Public**: http://localhost:5174
- **Health Check**: http://localhost:3001/health
- **Prisma Studio**: http://localhost:5555 (avec `npm run db:studio`)

## 🔐 Variables d'Environnement

Le projet utilise un fichier `.env_global` centralisé pour toutes les configurations. Copiez `.env_global.example` vers `.env_global` et configurez les variables suivantes :

### 🗄️ Base de Données
```env
DATABASE_URL="postgresql://username:password@localhost:5432/pestalert_dev"
```

### 🔑 OpenEPI API
```env
OPENEPI_CLIENT_ID="aresgn-testpestsAPI"
OPENEPI_CLIENT_SECRET="gHrAAcKkMkvEDfDijdqqBXULbqjGzlyK"
```

### 🔒 Sécurité
```env
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 📱 WhatsApp
```env
WHATSAPP_SESSION_PATH="./sessions"
```

Voir le fichier `.env_global.example` pour la liste complète des variables.

## 🛠️ Stack Technologique

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js + TypeScript
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Authentification**: JWT + bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Charts**: Chart.js + Recharts
- **Maps**: React Leaflet

### Bot & Intégrations
- **WhatsApp**: WhatsApp Web.js
- **API Externe**: OpenEPI Crop Health API
- **Image Processing**: Sharp
- **Scheduling**: node-cron

### DevOps & Tools
- **Monorepo**: npm Workspaces
- **Task Runner**: Nx (optionnel)
- **Linting**: ESLint + Prettier
- **Testing**: Jest + Vitest

## 📦 Packages Détaillés

### 🔧 Core (`packages/core`)
**Rôle**: Logique métier partagée et modèles de données
- **Prisma Schema**: Modèles de données (Farmers, Alerts, Agents, etc.)
- **Types TypeScript**: Interfaces partagées
- **Utilitaires**: Fonctions communes
- **Scripts DB**: Migration et initialisation

**Commandes principales**:
```bash
npm run db:generate    # Générer le client Prisma
npm run db:migrate     # Exécuter les migrations
npm run db:studio      # Ouvrir Prisma Studio
npm run db:init        # Initialiser avec des données de test
```

### 🌐 API (`packages/api`)
**Rôle**: Serveur backend REST API
- **Express Server**: API REST avec TypeScript
- **Authentification**: JWT + bcryptjs
- **Middleware**: CORS, Helmet, Rate Limiting
- **Routes**: Farmers, Alerts, Agents, Dashboard
- **WebSockets**: Socket.io pour temps réel
- **Intégrations**: OpenEPI API

**Endpoints principaux**:
- `GET /health` - Health check
- `POST /auth/login` - Authentification
- `GET /farmers` - Liste des agriculteurs
- `GET /alerts` - Alertes actives
- `GET /dashboard/metrics` - Métriques du dashboard

### 🤖 Bot (`packages/bot`)
**Rôle**: Bot WhatsApp pour les agriculteurs
- **WhatsApp Web.js**: Client WhatsApp automatisé
- **OpenEPI Integration**: Analyse de santé des cultures
- **Image Processing**: Traitement et analyse d'images
- **Audio Messages**: Réponses vocales automatiques
- **Flow Management**: Gestion des conversations

**Fonctionnalités**:
- Analyse d'images de cultures
- Détection de maladies et ravageurs
- Recommandations personnalisées
- Alertes en temps réel
- Interface en français

### 📊 Dashboard (`packages/dashboard`)
**Rôle**: Interface d'administration web
- **React + Vite**: Interface moderne et rapide
- **Tailwind CSS**: Styling responsive
- **React Leaflet**: Cartes interactives
- **Chart.js**: Graphiques et analytics
- **Socket.io Client**: Mises à jour temps réel

**Pages principales**:
- Vue d'ensemble (métriques)
- Gestion des agriculteurs
- Alertes actives
- Agents terrain
- Cartes géographiques

### 🌍 Web (`apps/web`)
**Rôle**: Site web public
- **Landing Page**: Présentation du service
- **Inscription**: Formulaire pour agriculteurs
- **Documentation**: Guide d'utilisation
- **Contact**: Informations de contact

## 🔧 Scripts et Commandes

### Scripts Globaux (Racine)
```bash
npm run dev              # Démarrer tous les services
npm run build            # Build tous les packages
npm run test             # Tests pour tous les packages
npm run lint             # Linting pour tous les packages
npm run db:migrate       # Migrations Prisma
npm run db:studio        # Prisma Studio
```

### Scripts par Package
```bash
# API
npm run api:start        # Démarrer l'API
cd packages/api && npm run dev

# Bot
npm run bot:start        # Démarrer le bot
cd packages/bot && npm run dev

# Dashboard
npm run dashboard:start  # Démarrer le dashboard
cd packages/dashboard && npm run dev

# Web
cd apps/web && npm run dev
```

### Scripts Windows (.bat)
| Script | Description | Port |
|--------|-------------|------|
| `start_all.bat` | Tous les services | Multiple |
| `start_api.bat` | API Backend | 3001 |
| `start_dashboard.bat` | Dashboard Admin | 5173 |
| `start_web.bat` | Site Web Public | 5174 |
| `start_bot.bat` | Bot WhatsApp | - |

## 🗄️ Base de Données

### Schéma Principal (Prisma)

#### Tables Principales
- **User** - Utilisateurs du système (admins, agents)
- **Farmer** - Agriculteurs inscrits
- **Alert** - Alertes de ravageurs
- **Agent** - Agents terrain
- **Intervention** - Missions d'intervention
- **CropAnalysis** - Analyses de cultures
- **Metric** - Métriques du système

#### Relations
- Un **Farmer** peut avoir plusieurs **Alert**
- Un **Agent** peut gérer plusieurs **Intervention**
- Une **Alert** peut déclencher une **Intervention**
- Un **Farmer** peut avoir plusieurs **CropAnalysis**

### Configuration Base de Données

#### PostgreSQL Local
```bash
# Installation PostgreSQL
# Windows: Télécharger depuis postgresql.org
# Ubuntu: sudo apt install postgresql postgresql-contrib
# macOS: brew install postgresql

# Créer la base de données
createdb pestalert_dev

# URL de connexion
DATABASE_URL="postgresql://username:password@localhost:5432/pestalert_dev"
```

#### PostgreSQL Cloud (Neon - Recommandé)
```bash
# 1. Créer un compte sur neon.tech
# 2. Créer une nouvelle base de données
# 3. Copier l'URL de connexion
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/pestalert"
```

## 🚀 Guide de Démarrage Rapide (5 minutes)

### 1. Installation Express
```bash
# Cloner et installer
git clone <repository-url>
cd pestalert-bot
npm install

# Configuration rapide
cp .env_global.example .env_global
# Éditer .env_global avec vos paramètres

# Base de données
cd packages/core
npm run db:generate
npm run db:migrate
npm run db:init

# Démarrer tous les services
cd ../..
start_all.bat
```

### 2. Accès aux Services
- **Dashboard**: http://localhost:5173 (admin@pestalert.com / admin123)
- **Site Web**: http://localhost:5174
- **API**: http://localhost:3001/health
- **Bot**: Scanner le QR code WhatsApp

## 🔍 Dépannage

### Problèmes Courants

#### 1. Erreur de Base de Données
```bash
# Vérifier la connexion
cd packages/core
npm run db:studio

# Réinitialiser si nécessaire
npm run db:reset
```

#### 2. Bot WhatsApp ne se connecte pas
```bash
# Supprimer les sessions
rm -rf packages/bot/sessions

# Redémarrer le bot
cd packages/bot
npm run dev
```

#### 3. Ports déjà utilisés
```bash
# Vérifier les ports utilisés
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Tuer les processus si nécessaire
taskkill /PID <PID> /F
```

#### 4. Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json

npm install
```

### Logs et Debugging

#### Logs API
```bash
cd packages/api
npm run dev
# Logs visibles dans la console
```

#### Logs Bot
```bash
cd packages/bot
npm run dev
# QR code et logs WhatsApp dans la console
```

#### Logs Dashboard
```bash
cd packages/dashboard
npm run dev
# Logs de build dans la console
```

## 🧪 Tests

### Tests Unitaires
```bash
# Tous les tests
npm run test

# Tests par package
cd packages/api && npm test
cd packages/bot && npm test
```

### Tests d'Intégration
```bash
# Test des services OpenEPI
cd packages/bot
npm run test:services

# Test d'authentification
npm run test:auth

# Test des routes API
npm run test:routes
```

### Tests Manuels
```bash
# Test du bot (mode simple)
cd packages/bot
npm run dev:simple

# Test de l'API
curl http://localhost:3001/health
```

## 📚 Documentation Supplémentaire

- **[Guide Bot WhatsApp](./packages/bot/README.md)** - Configuration détaillée du bot
- **[Guide Dashboard](./packages/dashboard/README.md)** - Interface d'administration
- **[API OpenEPI](./openepi_nodejs_documentation.md)** - Intégration OpenEPI
- **[Architecture Monorepo](./agribot_monorepo_readme.md)** - Structure du projet

## 🔄 Workflow de Développement

### 1. Développement Local
```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Développer et tester
npm run dev
npm run test

# Commit et push
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

### 2. Structure des Commits
```bash
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatage code
refactor: refactorisation
test: ajout de tests
chore: tâches de maintenance
```

### 3. Déploiement
```bash
# Build pour production
npm run build

# Tests avant déploiement
npm run test
npm run lint

# Déploiement (selon votre plateforme)
# Voir les scripts dans tools/scripts/
```

## 🤝 Contribution

### Comment Contribuer
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'feat: Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code
- **TypeScript** pour tout le code
- **ESLint + Prettier** pour le formatage
- **Tests unitaires** pour les nouvelles fonctionnalités
- **Documentation** pour les APIs publiques

### Review Process
- Code review obligatoire
- Tests automatiques passants
- Documentation mise à jour
- Pas de breaking changes sans discussion

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support et Contact

### Support Technique
- **Issues GitHub**: Pour les bugs et demandes de fonctionnalités
- **Discussions**: Pour les questions générales
- **Wiki**: Documentation détaillée

### Équipe de Développement
- **Lead Developer**: [Nom]
- **Backend**: [Nom]
- **Frontend**: [Nom]
- **DevOps**: [Nom]

### Contact
- **Email**: support@pestalert.com
- **Slack**: #pestalert-dev
- **Teams**: PestAlert Development

---

## 🌟 Remerciements

- **OpenEPI** pour l'API de santé des cultures
- **WhatsApp Web.js** pour l'intégration WhatsApp
- **Prisma** pour l'ORM moderne
- **Communauté Open Source** pour les outils utilisés

---

**Développé avec ❤️ pour les agriculteurs de l'Afrique**

*Version 1.0.0 - Dernière mise à jour: 2025-01-12*
