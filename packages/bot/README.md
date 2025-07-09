# PestAlert WhatsApp Bot 🌾🤖

Bot WhatsApp intelligent pour la détection et la prévention des parasites agricoles.

## Fonctionnalités

### 🔍 Analyse d'Images
- Analyse automatique des photos de cultures
- Détection de maladies et parasites
- Recommandations personnalisées

### 📱 Commandes Disponibles
- `!ping` - Test de connexion
- `!help` / `!aide` - Aide complète
- `!alert` - Signaler un problème urgent
- `!conseils` - Conseils agricoles
- `!contact` - Contacter un expert
- `!meteo` - Météo agricole
- `!maladies` - Maladies courantes

### 🤖 Réponses Intelligentes
- Reconnaissance de langage naturel
- Réponses contextuelles
- Support multilingue (français)

## Installation

### Prérequis
- Node.js v18+
- Compte WhatsApp avec accès à WhatsApp Web

### Configuration
1. Copier le fichier de configuration :
```bash
cp .env.example .env
```

2. Modifier les variables d'environnement dans `.env`

3. Installer les dépendances :
```bash
npm install
```

### Démarrage

#### Mode développement
```bash
npm run dev
```

#### Mode production
```bash
npm run build
npm start
```

## Première Connexion

1. Lancer le bot avec `npm run dev`
2. Scanner le QR code avec WhatsApp
3. Le bot sera connecté et prêt !

## Utilisation

### Analyse d'Images
1. Envoyer une photo de vos cultures
2. Le bot analyse automatiquement l'image
3. Recevoir les résultats et recommandations

### Commandes
Taper `!help` pour voir toutes les commandes disponibles.

### Alertes d'Urgence
Utiliser `!alert` pour signaler un problème critique nécessitant une intervention rapide.

## Architecture

```
src/
├── index.ts          # Point d'entrée principal
├── handlers/         # Gestionnaires de messages (futur)
├── services/         # Services d'analyse (futur)
└── utils/           # Utilitaires (futur)
```

## Développement

### Scripts disponibles
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en production
- `npm test` - Tests unitaires

### Ajout de nouvelles fonctionnalités
1. Modifier `src/index.ts`
2. Ajouter de nouvelles commandes dans `handleCommands()`
3. Tester avec `npm run dev`

## Sécurité

- Sessions WhatsApp stockées localement
- Authentification automatique après première connexion
- Possibilité de limiter l'accès par numéros autorisés

## Support

Pour toute question ou problème :
- 📧 Email: support@pestalert.com
- 📱 Urgence: +33 1 XX XX XX XX

## Licence

Propriétaire - PestAlert © 2024
