# 🚀 Guide de Démarrage Rapide - Dashboard PestAlert

## 📋 Prérequis

1. **Node.js 18+** installé
2. **PostgreSQL** (local ou Neon) configuré
3. **Variables d'environnement** configurées

## ⚡ Démarrage Rapide (5 minutes)

### 1. Configuration de la Base de Données

```bash
# Aller dans le package core
cd packages/core

# Copier le fichier d'environnement
cp .env.example .env

# Éditer le fichier .env avec votre URL de base de données
# DATABASE_URL="postgresql://username:password@localhost:5432/pestalert"
```

### 2. Installation et Initialisation

```bash
# Installer les dépendances du core
npm install

# Générer le client Prisma
npm run db:generate

# Exécuter les migrations (créer les tables)
npm run db:migrate

# Initialiser avec des données de test
npm run db:init
```

### 3. Démarrer l'API Backend

```bash
# Aller dans le package API
cd ../api

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer le serveur API
npm run dev
```

L'API sera disponible sur `http://localhost:3001`

### 4. Démarrer le Dashboard

```bash
# Aller dans le package dashboard
cd ../dashboard

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer le dashboard
npm run dev
```

Le dashboard sera disponible sur `http://localhost:5173`

## 🔐 Connexion

Utilisez les identifiants par défaut :
- **Email** : `admin@pestalert.com`
- **Mot de passe** : `admin123`

⚠️ **Important** : Changez ces identifiants en production !

## 🎯 Test des Fonctionnalités

### 1. Page d'Accueil (Dashboard)
- ✅ Vérifiez les KPIs affichés
- ✅ Consultez le statut des services
- ✅ Observez les graphiques d'utilisation

### 2. Analytics
- ✅ Changez la période d'analyse
- ✅ Vérifiez les répartitions par type
- ✅ Consultez l'activité des utilisateurs

### 3. Alertes
- ✅ Filtrez par statut et sévérité
- ✅ Testez la pagination
- ✅ Consultez les détails des alertes

### 4. Utilisateurs
- ✅ Vérifiez les statistiques d'activité
- ✅ Consultez la répartition géographique

### 5. Paramètres
- ✅ Modifiez votre profil
- ✅ Testez le changement de mot de passe
- ✅ Configurez les notifications

## 🔧 Dépannage

### Problème : "Cannot connect to database"
```bash
# Vérifiez que PostgreSQL est démarré
# Vérifiez l'URL dans DATABASE_URL
# Testez la connexion manuellement
```

### Problème : "API not responding"
```bash
# Vérifiez que l'API est démarrée sur le port 3001
# Vérifiez les logs de l'API
# Vérifiez VITE_API_URL dans le dashboard
```

### Problème : "Login failed"
```bash
# Vérifiez que la base de données est initialisée
# Exécutez : npm run db:init dans packages/core
# Vérifiez que l'utilisateur admin existe
```

## 📊 Données de Test

Le script d'initialisation crée automatiquement :
- **1 utilisateur admin** : admin@pestalert.com
- **3 agriculteurs de test** avec différentes localisations
- **Sessions de test** pour simuler l'activité
- **Analyses d'images** avec différents résultats
- **Métriques système** pour les dernières 24h

## 🔄 Actualisation des Données

Les données se mettent à jour automatiquement :
- **Métriques principales** : toutes les 30 secondes
- **Graphiques d'utilisation** : toutes les 5 minutes
- **Performance système** : toutes les 2 minutes
- **Alertes** : toutes les 30 secondes

## 🎨 Personnalisation

### Couleurs et Thème
Les couleurs principales sont définies dans `tailwind.config.js` :
- **Primary** : Vert agriculture (#16a34a)
- **Secondary** : Bleu ciel (#0ea5e9)
- **Warning** : Orange (#f59e0b)
- **Danger** : Rouge (#dc2626)

### Ajout de Nouvelles Métriques
1. Étendre `DashboardDataService`
2. Ajouter les endpoints API
3. Créer les composants frontend
4. Mettre à jour les types TypeScript

## 📱 Responsive Design

Le dashboard est optimisé pour :
- **Desktop** : Expérience complète avec sidebar
- **Tablet** : Navigation adaptée
- **Mobile** : Interface tactile optimisée

## 🚀 Déploiement

### Développement
```bash
npm run dev  # Dashboard + API en mode développement
```

### Production
```bash
npm run build    # Build du dashboard
npm run preview  # Prévisualisation du build
```

### Variables d'Environnement Production
```env
DATABASE_URL=postgresql://prod_url
JWT_SECRET=super_secure_secret
VITE_API_URL=https://api.pestalert.com
NODE_ENV=production
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs de l'API et du dashboard
2. Consultez la documentation dans `README.md`
3. Vérifiez l'état d'implémentation dans `IMPLEMENTATION_STATUS.md`

---

🌾 **PestAlert Dashboard** - Votre tableau de bord pour l'agriculture intelligente
