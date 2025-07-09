# AgriBot - Système d'Alerte Précoce pour Ravageurs

## Vue d'ensemble

AgriBot est un système d'alerte précoce qui utilise l'intelligence artificielle et les données satellites pour détecter et prévenir les attaques de ravageurs (notamment les chenilles légionnaires) sur les cultures agricoles au Togo. La solution combine les APIs OpenEPI existantes avec une interface WhatsApp accessible aux agriculteurs.

## Architecture Monorepo

```
agribot/
├── packages/
│   ├── core/                    # Logique métier partagée
│   ├── api/                     # API Backend
│   ├── bot/                     # Bot WhatsApp
│   ├── dashboard/               # Dashboard Admin (React)
│   ├── mobile/                  # Interface mobile (React Native)
│   └── shared/                  # Composants et utils partagés
├── apps/
│   ├── web/                     # Application web principale
│   └── admin/                   # Dashboard d'administration
├── tools/
│   ├── scripts/                 # Scripts de déploiement
│   └── config/                  # Configuration partagée
└── docs/                        # Documentation
```

## Stack Technologique

- **Monorepo**: Nx ou Lerna
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Base de données**: Neon (PostgreSQL)
- **ORM**: Prisma
- **Bot WhatsApp**: whatsapp-web.js
- **SMS**: TextBee
- **APIs Externes**: OpenEPI, WhatsApp Business API
- **Cartes**: Leaflet.js
- **Graphiques**: Chart.js/Recharts
- **Déploiement**: Vercel (Frontend) + Railway/Render (Backend)

## Packages et Dépendances

### Package Core (`packages/core`)
```json
{
  "dependencies": {
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21"
  }
}
```

### Package API (`packages/api`)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.4.0",
    "node-cron": "^3.0.2",
    "socket.io": "^4.7.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "express-validator": "^7.0.0"
  }
}
```

### Package Bot (`packages/bot`)
```json
{
  "dependencies": {
    "whatsapp-web.js": "github:pedroslopez/whatsapp-web.js",
    "textbee": "github:vernu/textbee",
    "qrcode-terminal": "^0.12.0",
    "sharp": "^0.32.0",
    "node-schedule": "^2.1.1"
  }
}
```

### Package Dashboard (`packages/dashboard`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.0.0",
    "react-query": "^3.39.0",
    "react-leaflet": "^4.2.0",
    "leaflet": "^1.9.0",
    "chart.js": "^4.0.0",
    "react-chartjs-2": "^5.0.0",
    "recharts": "^2.8.0",
    "react-table": "^7.8.0",
    "react-hook-form": "^7.45.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.263.0",
    "socket.io-client": "^4.7.0",
    "date-fns": "^2.30.0"
  }
}
```

### Package Mobile (`packages/mobile`)
```json
{
  "dependencies": {
    "react-native": "^0.72.0",
    "react-native-maps": "^1.7.0",
    "react-native-image-picker": "^5.0.0",
    "react-native-push-notification": "^8.1.0",
    "react-native-geolocation-service": "^5.3.0"
  }
}
```

## Interfaces à Créer

### 1. Interface Bot WhatsApp (`packages/bot`)

**Description**: Interface conversationnelle via WhatsApp permettant aux agriculteurs de recevoir des alertes et d'interagir avec le système.

**Fonctionnalités**:
- Réception et analyse d'images de cultures
- Diagnostic automatique via OpenEPI Crop Health API
- Envoi d'alertes personnalisées avec boutons interactifs
- Géolocalisation GPS automatique
- Historique des conversations par agriculteur
- Menu interactif avec boutons
- Système de commandes rapides
- Support multilingue (Français/Ewe/Kabye)
- Intégration paiement mobile money
- Notifications push personnalisées

**Composants principaux**:
- `WhatsAppBot` - Gestionnaire principal du bot
- `MessageHandler` - Traitement des messages entrants
- `MediaHandler` - Gestion des photos et médias
- `AlertManager` - Système d'alertes
- `LocationService` - Gestion de la géolocalisation
- `LanguageManager` - Gestion multilingue

### 2. API Backend (`packages/api`)

**Description**: API REST pour orchestrer toutes les fonctionnalités du système.

**Fonctionnalités**:
- Endpoints pour l'analyse de cultures
- Gestion des agriculteurs et abonnements
- Système d'alertes et notifications
- Intégration avec OpenEPI APIs
- Gestion des interventions terrain
- Analytics et reporting
- Authentification et autorisation
- Rate limiting et sécurité

**Endpoints principaux**:
- `/api/analyze-crop` - Analyse photo via OpenEPI
- `/api/send-alert` - Envoi alertes WhatsApp/SMS
- `/api/weather/:location` - Données météo
- `/api/farmers` - CRUD agriculteurs
- `/api/interventions` - Gestion interventions
- `/api/subscriptions` - Gestion abonnements
- `/api/analytics` - Données analytiques

### 3. Dashboard Admin (`packages/dashboard`)

**Description**: Interface web pour la gestion et le monitoring du système par les administrateurs.

**Fonctionnalités**:
- Vue d'ensemble temps réel
- Carte interactive des alertes en cours
- Statut des agents terrain (localisation, disponibilité)
- Tableau de bord des interventions
- Gestion des agriculteurs
- Analytics et reporting
- Configuration du système
- Monitoring des performances

**Composants principaux**:
- `AlertsMap` - Carte interactive des alertes
- `FarmersTable` - Gestion des agriculteurs
- `InterventionPanel` - Gestion des interventions
- `AnalyticsCharts` - Graphiques et statistiques
- `WeatherWidget` - Conditions météo
- `AgentTracker` - Suivi des agents terrain

### 4. Interface Mobile (`packages/mobile`)

**Description**: Application mobile native pour les agents terrain.

**Fonctionnalités**:
- Réception des missions d'intervention
- Navigation GPS vers les exploitations
- Capture et envoi de photos
- Rapport d'intervention
- Géolocalisation temps réel
- Notifications push
- Mode hors ligne

**Composants principaux**:
- `MissionList` - Liste des missions
- `Navigation` - Navigation GPS
- `CameraCapture` - Capture de photos
- `ReportForm` - Formulaire de rapport
- `LocationTracker` - Suivi géolocalisation

### 5. Interface Web Publique (`apps/web`)

**Description**: Site web public pour l'inscription et l'information.

**Fonctionnalités**:
- Page d'accueil informative
- Formulaire d'inscription agriculteurs
- Présentation des tarifs
- Documentation d'utilisation
- Témoignages et cas d'usage
- Support client

### 6. Core Logic (`packages/core`)

**Description**: Logique métier partagée et modèles de données.

**Fonctionnalités**:
- Modèles de données Prisma
- Utilitaires de validation
- Algorithmes de prédiction
- Types TypeScript partagés
- Services de base de données
- Helpers et constantes

## Base de Données (Neon PostgreSQL)

### Schéma Principal

```sql
-- Agriculteurs
CREATE TABLE farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  location JSONB NOT NULL,
  subscription_type VARCHAR(20) DEFAULT 'basic',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Alertes
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmers(id),
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  location JSONB NOT NULL,
  image_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Interventions
CREATE TABLE interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES alerts(id),
  agent_id UUID REFERENCES agents(id),
  status VARCHAR(20) DEFAULT 'pending',
  estimated_time INTEGER,
  actual_time INTEGER,
  report TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agents terrain
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  location JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Commandes d'Initialisation

### 1. Initialisation du Monorepo

```bash
# Cloner le repository
git clone <repository-url>
cd agribot

# Installer les dépendances globales
npm install -g @nx/cli
# ou
npm install -g lerna

# Initialiser le workspace Nx
npx create-nx-workspace@latest agribot --preset=ts

# Ou avec Lerna
npx lerna init
```

### 2. Création des Packages

```bash
# Créer les packages
nx generate @nx/node:application api
nx generate @nx/node:application bot
nx generate @nx/react:application dashboard
nx generate @nx/react:application web
nx generate @nx/node:library core
nx generate @nx/react:library shared

# Ou avec Lerna
mkdir -p packages/{api,bot,dashboard,mobile,core,shared}
mkdir -p apps/{web,admin}
```

### 3. Configuration Base de Données

```bash
# Installer Prisma
cd packages/core
npm install prisma @prisma/client
npx prisma init

# Configurer la connection Neon dans .env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Créer et appliquer les migrations
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Configuration du Bot WhatsApp

```bash
cd packages/bot
npm install whatsapp-web.js qrcode-terminal

# Installer TextBee pour SMS
npm install textbee

# Créer le fichier de configuration
touch config/bot.config.js
```

### 5. Configuration de l'API

```bash
cd packages/api
npm install express cors helmet express-rate-limit jsonwebtoken bcryptjs multer axios

# Créer la structure
mkdir -p src/{routes,controllers,middleware,services,utils}
touch src/server.ts
```

### 6. Configuration du Dashboard

```bash
cd packages/dashboard
npm install react-leaflet leaflet chart.js react-chartjs-2 react-table

# Installer Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 7. Scripts de Développement

```bash
# Package.json racine
{
  "scripts": {
    "dev": "nx run-many --target=serve --projects=api,dashboard,bot --parallel",
    "build": "nx run-many --target=build --projects=api,dashboard,web",
    "test": "nx run-many --target=test --all",
    "db:migrate": "cd packages/core && npx prisma migrate dev",
    "db:studio": "cd packages/core && npx prisma studio",
    "bot:start": "nx serve bot",
    "api:start": "nx serve api",
    "dashboard:start": "nx serve dashboard"
  }
}
```

### 8. Variables d'Environnement

```bash
# Créer .env à la racine
touch .env

# Ajouter les variables
DATABASE_URL="postgresql://..."
OPENAPI_API_KEY="your-openapi-key"
WHATSAPP_SESSION_PATH="./whatsapp-session"
SMS_API_KEY="your-sms-api-key"
JWT_SECRET="your-jwt-secret"
NODE_ENV="development"
```

### 9. Démarrage du Projet

```bash
# Installer toutes les dépendances
npm install

# Démarrer tous les services en développement
npm run dev

# Ou démarrer individuellement
npm run api:start    # API Backend
npm run bot:start    # Bot WhatsApp
npm run dashboard:start  # Dashboard Admin
```

### 10. Commandes Utiles

```bash
# Générer les types Prisma
npm run db:generate

# Réinitialiser la base de données
npm run db:reset

# Voir la base de données
npm run db:studio

# Construire pour production
npm run build

# Lancer les tests
npm run test

# Linter le code
npm run lint

# Formater le code
npm run format
```

## Structure de Développement

### Workflow Git
```bash
# Branches principales
main          # Production
develop       # Développement
feature/*     # Nouvelles fonctionnalités
bugfix/*      # Corrections de bugs
hotfix/*      # Correctifs urgents
```

### Déploiement
- **Frontend**: Vercel
- **Backend**: Railway ou Render
- **Base de données**: Neon (PostgreSQL)
- **Bot**: VPS ou serveur dédié

## Monitoring et Maintenance

### Métriques à Surveiller
- Nombre d'alertes envoyées
- Temps de réponse des interventions
- Taux de succès des diagnostics
- Utilisation des abonnements
- Performance des APIs

### Outils de Monitoring
- Logs centralisés
- Alertes système
- Monitoring des performances
- Backup automatique des données

## Prochaines Étapes

1. **Phase 1**: Setup infrastructure et API de base
2. **Phase 2**: Développement du bot WhatsApp
3. **Phase 3**: Intégration OpenEPI et prédictions
4. **Phase 4**: Dashboard admin et analytics
5. **Phase 5**: Tests et déploiement production

Ce README fournit une base solide pour démarrer le développement d'AgriBot avec une architecture monorepo moderne et scalable.