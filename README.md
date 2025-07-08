# 🌾 PestAlert - Système d'Alerte Précoce pour Ravageurs

## 📋 Description

PestAlert est un système d'alerte précoce qui utilise l'intelligence artificielle et les données satellites pour détecter et prévenir les attaques de ravageurs (notamment les chenilles légionnaires) sur les cultures agricoles au Togo. La solution combine les APIs OpenEPI existantes avec une interface WhatsApp accessible aux agriculteurs.

## 🏗️ Architecture Monorepo

```
pestalert-bot/
├── packages/
│   ├── core/                    # Logique métier partagée + Prisma
│   ├── api/                     # API Backend (Express + TypeScript)
│   ├── bot/                     # Bot WhatsApp
│   ├── dashboard/               # Dashboard Admin (React + Vite)
│   ├── mobile/                  # Interface mobile (React Native)
│   └── shared/                  # Composants et utils partagés
├── apps/
│   ├── web/                     # Application web publique (React + Vite)
│   └── admin/                   # Dashboard d'administration
├── tools/
│   ├── scripts/                 # Scripts de déploiement
│   └── config/                  # Configuration partagée
└── docs/                        # Documentation
```

## 🚀 Installation Rapide

### Prérequis
- Node.js v18+ 
- npm v8+
- PostgreSQL (ou compte Neon)

### 1. Cloner et installer
```bash
git clone <repository-url>
cd pestalert-bot
npm install
```

### 2. Configuration
1. Copiez `.env.example` vers `.env`
2. Configurez votre base de données PostgreSQL
3. Ajoutez vos clés API

### 3. Démarrage
```bash
# Démarrer tous les services
start_all.bat

# Ou individuellement
start_api.bat       # API Backend (port 3000)
start_dashboard.bat # Dashboard (port 5173)
start_web.bat       # Site Web (port 5174)
start_bot.bat       # Bot WhatsApp
```

## 🌐 URLs de Développement

- **API Backend**: http://localhost:3000
- **Dashboard Admin**: http://localhost:5173
- **Site Web Public**: http://localhost:5174
- **Health Check**: http://localhost:3000/health

## 🛠️ Stack Technologique

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Base de données**: PostgreSQL + Prisma ORM
- **Bot**: WhatsApp Web.js https://github.com/pedroslopez/whatsapp-web.js.git
- **Build**: Vite
- **Monorepo**: Workspaces npm

## 📦 Packages

### 🔧 Core (`packages/core`)
- Modèles de données Prisma
- Types TypeScript partagés
- Utilitaires communs

### 🌐 API (`packages/api`)
- Serveur Express
- Routes REST
- Authentification JWT
- Intégration OpenEPI

### 🤖 Bot (`packages/bot`)
- Client WhatsApp
- Traitement des messages
- Analyse d'images
- Notifications

### 📊 Dashboard (`packages/dashboard`)
- Interface d'administration
- Gestion des alertes
- Analytics en temps réel
- Cartes interactives

### 🌍 Web (`apps/web`)
- Site web public
- Inscription agriculteurs
- Documentation
- Landing page

## 🔧 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `start_all.bat` | Démarre tous les services |
| `start_api.bat` | API Backend uniquement |
| `start_dashboard.bat` | Dashboard uniquement |
| `start_web.bat` | Site web uniquement |
| `start_bot.bat` | Bot WhatsApp uniquement |

## 🗄️ Base de Données

Le projet utilise Prisma avec PostgreSQL. Schéma principal :

- **Farmers** - Agriculteurs inscrits
- **Alerts** - Alertes de ravageurs
- **Agents** - Agents terrain
- **Interventions** - Missions d'intervention

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ pour les agriculteurs du Togo**
