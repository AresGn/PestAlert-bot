# Intégration OpenEPI - Bot WhatsApp PestAlert

## 🎯 Vue d'ensemble

Ce document décrit l'intégration réussie de l'API OpenEPI Crop Health dans le bot WhatsApp PestAlert. Le bot peut maintenant effectuer des analyses réelles de santé des cultures en utilisant l'intelligence artificielle d'OpenEPI.

## 🚀 Fonctionnalités implémentées

### ✅ Services principaux
- **CropHealthService** : Intégration avec l'API OpenEPI pour l'analyse des cultures
- **ImageProcessingService** : Prétraitement des images selon les spécifications OpenEPI
- **PestMonitoringService** : Orchestration complète de l'analyse et génération d'alertes
- **LoggingService** : Suivi détaillé des analyses et erreurs
- **ErrorHandlingService** : Gestion robuste des erreurs avec messages conviviaux

### 🔍 Types d'analyses disponibles
1. **Analyse binaire** : Détermine si la culture est saine ou malade
2. **Analyse multi-classes** : Identifie parmi 13 maladies spécifiques
3. **Analyse spécialisée** : Analyse approfondie pour 17 classes de maladies

### 🚨 Système d'alertes
- **Alertes critiques** : Détection de chenilles légionnaires avec conditions météo favorables
- **Alertes préventives** : Risques élevés nécessitant une surveillance accrue
- **Recommandations personnalisées** : Conseils adaptés selon le type de maladie détectée

## 📁 Structure des fichiers

```
src/
├── config/
│   └── openepi.ts              # Configuration API OpenEPI
├── services/
│   ├── cropHealthService.ts    # Service principal OpenEPI
│   ├── imageProcessingService.ts # Traitement d'images
│   ├── pestMonitoringService.ts # Orchestration
│   ├── loggingService.ts       # Logging
│   └── errorHandlingService.ts # Gestion d'erreurs
├── types/
│   └── index.ts                # Types TypeScript
├── index.ts                    # Bot principal
└── test-services.ts            # Tests d'intégration
```

## ⚙️ Configuration

### Variables d'environnement (.env)
```bash
# Configuration OpenEPI
OPENEPI_BASE_URL=https://api.openepi.io
OPENEPI_TIMEOUT=30000

# Configuration WhatsApp
WHATSAPP_SESSION_PATH=./sessions
WHATSAPP_SESSION_SECRET=your_secret_key

# Configuration de logging
LOG_LEVEL=info
NODE_ENV=development
DEBUG=true
```

## 🧪 Tests et validation

### Lancer les tests
```bash
npm run test:services
```

### Résultats attendus
- ✅ Service de traitement d'images opérationnel
- ✅ Connexion à l'API OpenEPI réussie
- ✅ Gestion d'erreurs fonctionnelle
- ✅ Logging opérationnel

## 🔄 Flux d'analyse d'images

1. **Réception** : L'utilisateur envoie une photo via WhatsApp
2. **Validation** : Vérification du format et de la qualité de l'image
3. **Prétraitement** : Redimensionnement selon les specs OpenEPI (224x224px)
4. **Analyse** : Appel simultané aux APIs binaire et multi-classes
5. **Évaluation** : Détermination du niveau d'alerte
6. **Réponse** : Envoi des résultats et recommandations à l'utilisateur
7. **Logging** : Enregistrement de l'analyse pour suivi

## 📊 Types de réponses

### Réponse normale
```
🌾 Résultats d'analyse PestAlert

📊 État général: ✅ SAINE
🔍 Confiance: 85.2%

🦠 Analyse détaillée:
• Problème principal détecté: Healthy
• Niveau de confiance: 85.2%
• Niveau de risque: LOW

💡 Recommandations:
• ✅ Continuer la surveillance régulière
• 🌱 Maintenir les bonnes pratiques
• 💧 Optimiser l'arrosage et la ventilation
```

### Alerte critique
```
🚨 CHENILLES LÉGIONNAIRES DÉTECTÉES !

📊 Niveau de confiance: 87.3%
🌤️ Conditions météo: FAVORABLES À LA PROPAGATION

⚡ Actions recommandées:
[1] 🆘 Intervention urgente
[2] 📞 Parler à expert
[3] 🛒 Commander traitement
```

## 🛠️ Commandes disponibles

- `!status` : Vérifier le statut des services d'analyse
- `!help` : Afficher l'aide complète
- `!ping` : Test de connexion
- Envoi d'image : Analyse automatique

## 🔧 Dépannage

### Problèmes courants

1. **Service OpenEPI indisponible**
   - Vérifier la connectivité internet
   - Vérifier l'URL de l'API dans .env

2. **Erreur de traitement d'image**
   - Vérifier le format de l'image (JPEG, PNG, WebP)
   - Vérifier la taille (min 100x100px, max 4000x4000px)

3. **Erreur de session WhatsApp**
   - Supprimer le dossier ./sessions
   - Relancer le bot et rescanner le QR code

### Logs utiles
Les logs sont affichés dans la console avec les niveaux :
- `INFO` : Activité normale
- `WARN` : Alertes et avertissements
- `ERROR` : Erreurs nécessitant attention

## 🚀 Démarrage

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Configuration**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos paramètres
   ```

3. **Compilation**
   ```bash
   npm run build
   ```

4. **Tests**
   ```bash
   npm run test:services
   ```

5. **Lancement**
   ```bash
   npm run dev
   ```

6. **Scanner le QR code** avec WhatsApp

## 📈 Métriques et monitoring

Le système enregistre automatiquement :
- Nombre d'analyses effectuées
- Types de maladies détectées
- Taux de confiance des prédictions
- Alertes critiques déclenchées
- Erreurs et leur fréquence

## 🔮 Améliorations futures

- [ ] Intégration de l'API météo OpenEPI
- [ ] Base de données pour historique des analyses
- [ ] Interface web pour visualisation des données
- [ ] Notifications push pour alertes critiques
- [ ] Support multilingue
- [ ] Géolocalisation automatique

## 📞 Support

En cas de problème :
1. Vérifier les logs dans la console
2. Lancer `npm run test:services` pour diagnostiquer
3. Vérifier la configuration dans .env
4. Consulter la documentation OpenEPI

---

**Status** : ✅ Intégration complète et fonctionnelle
**Version** : 1.0.0
**Dernière mise à jour** : 2025-07-09
