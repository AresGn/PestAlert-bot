# 🚀 Guide de Démarrage Rapide - PestAlert

## ⚡ Installation Express (5 minutes)

### 1. Prérequis
- **Node.js 18+** installé
- **PostgreSQL** (local ou Neon)
- **Git** pour cloner le repository

### 2. Installation Automatique
```bash
# Cloner le repository
git clone <repository-url>
cd pestalert-bot

# Lancer l'installation automatique
setup.bat
```

Le script `setup.bat` va :
- ✅ Vérifier les prérequis
- 📦 Installer toutes les dépendances
- 🔧 Créer tous les fichiers .env
- 🗄️ Configurer la base de données

### 3. Configuration Rapide
```bash
# Éditer le fichier de configuration global
notepad .env_global

# Variables essentielles à configurer :
DATABASE_URL="postgresql://username:password@localhost:5432/pestalert_dev"
OPENEPI_CLIENT_ID="aresgn-testpestsAPI"
OPENEPI_CLIENT_SECRET="gHrAAcKkMkvEDfDijdqqBXULbqjGzlyK"
JWT_SECRET="your_super_secret_jwt_key_here"
```

### 4. Démarrage
```bash
# Démarrer tous les services
start_all.bat
```

### 5. Accès aux Applications
- **Dashboard Admin**: http://localhost:5173
  - Login: `admin@pestalert.com`
  - Password: `admin123`
- **Site Web Public**: http://localhost:5174
- **API Health Check**: http://localhost:3001/health

---

## 🔧 Installation Manuelle (Détaillée)

### Étape 1: Clonage et Dépendances
```bash
git clone <repository-url>
cd pestalert-bot
npm install
```

### Étape 2: Configuration Base de Données
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

# Initialiser avec des données de test
npm run db:init
```

### Étape 3: Configuration des Packages
```bash
# Configuration automatique de tous les .env
cd ../..
node configure-env.js

# Ou manuellement pour chaque package :
cd packages/api && cp .env.example .env
cd ../bot && cp .env.example .env
cd ../dashboard && cp .env.example .env
cd ../../apps/web && cp .env.example .env
```

### Étape 4: Démarrage des Services

#### Option A: Tous en une fois
```bash
start_all.bat
```

#### Option B: Un par un
```bash
# Terminal 1: API Backend
cd packages/api
npm run dev

# Terminal 2: Dashboard
cd packages/dashboard
npm run dev

# Terminal 3: Site Web
cd apps/web
npm run dev

# Terminal 4: Bot WhatsApp
cd packages/bot
npm run dev
```

---

## 🤖 Configuration du Bot WhatsApp

### 1. Démarrer le Bot
```bash
cd packages/bot
npm run dev
```

### 2. Scanner le QR Code
- Un QR code apparaîtra dans la console
- Ouvrez WhatsApp sur votre téléphone
- Allez dans **Paramètres > Appareils liés**
- Scannez le QR code

### 3. Tester le Bot
- Envoyez `Hi PestAlerte 👋` au bot
- Le bot devrait répondre avec un menu d'options

---

## 🗄️ Configuration Base de Données

### Option 1: PostgreSQL Local
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

### Option 2: Neon (Cloud - Recommandé)
```bash
# 1. Créer un compte sur neon.tech
# 2. Créer une nouvelle base de données
# 3. Copier l'URL de connexion
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/pestalert"
```

---

## 🔍 Vérification de l'Installation

### Tests de Santé
```bash
# API Backend
curl http://localhost:3001/health

# Dashboard (ouvrir dans le navigateur)
http://localhost:5173

# Site Web (ouvrir dans le navigateur)
http://localhost:5174
```

### Tests du Bot
```bash
cd packages/bot
npm run test:services
```

### Base de Données
```bash
cd packages/core
npm run db:studio
# Ouvre Prisma Studio sur http://localhost:5555
```

---

## 🚨 Dépannage Rapide

### Problème: Erreur de Base de Données
```bash
# Vérifier la connexion
cd packages/core
npm run db:studio

# Réinitialiser si nécessaire
npm run db:reset
```

### Problème: Bot WhatsApp ne se connecte pas
```bash
# Supprimer les sessions
rm -rf packages/bot/sessions

# Redémarrer le bot
cd packages/bot
npm run dev
```

### Problème: Ports déjà utilisés
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Problème: Dépendances
```bash
# Nettoyer et réinstaller
npm run clean
npm install
```

---

## 📚 Ressources Utiles

- **[README Principal](./README.md)** - Documentation complète
- **[Guide Bot](./packages/bot/README.md)** - Configuration détaillée du bot
- **[Guide Dashboard](./packages/dashboard/README.md)** - Interface d'administration
- **[Variables d'Environnement](./.env_global.example)** - Configuration complète

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** dans la console de chaque service
2. **Consultez la documentation** dans les dossiers respectifs
3. **Ouvrez une issue** sur GitHub avec les détails de l'erreur

---

**🎉 Félicitations ! Votre environnement PestAlert est prêt !**
