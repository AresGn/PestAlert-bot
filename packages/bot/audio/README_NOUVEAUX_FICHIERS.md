# Fichiers Audio Nécessaires pour le Nouveau Flux d'Accueil

## 📋 Fichiers Audio Existants
- ✅ `Reponse.mp3` - Réponse normale pour détection de ravageurs
- ✅ `Alerte.mp3` - Alerte critique pour détection de ravageurs  
- ✅ `Incertaine.mp3` - Réponse incertaine (voir README_Incertaine.md)

## 🆕 Nouveaux Fichiers Audio Requis

### 1. `Welcome.mp3` - Message de Bienvenue
**Déclencheur:** Quand l'utilisateur tape "Hi PestAlerte 👋"
**Contenu suggéré:**
```
Bonjour et bienvenue sur PestAlert ! 
Je suis votre assistant agricole intelligent. 
Je peux vous aider à analyser la santé de vos cultures, 
détecter la présence de ravageurs, et envoyer des alertes urgentes. 
Choisissez une option dans le menu qui suit.
```

### 2. `CropSains.mp3` - Culture Saine
**Déclencheur:** Quand l'analyse de santé (Option 1) détecte une culture saine
**Contenu suggéré:**
```
Excellente nouvelle ! Votre culture semble être en bonne santé. 
Les analyses montrent des signes positifs. 
Continuez vos bonnes pratiques agricoles et surveillez régulièrement l'évolution. 
Consultez le message texte pour plus de détails.
```

### 3. `CropMalade.mp3` - Culture Malade
**Déclencheur:** Quand l'analyse de santé (Option 1) détecte une culture malade
**Contenu suggéré:**
```
Attention ! Votre culture nécessite une surveillance particulière. 
Nos analyses détectent des signes préoccupants. 
Je vous recommande d'examiner votre culture de plus près 
et de consulter un expert agricole si nécessaire. 
Consultez le message texte pour les recommandations détaillées.
```

## 🎯 Spécifications Techniques

### Format Audio Recommandé
- **Format:** MP3
- **Qualité:** 128 kbps minimum
- **Durée:** 15-30 secondes maximum
- **Langue:** Français
- **Ton:** Professionnel mais accessible

### Considérations pour l'Enregistrement
1. **Clarté:** Voix claire et bien articulée
2. **Débit:** Parler à un rythme modéré
3. **Contexte:** Adapté aux agriculteurs francophones
4. **Professionnalisme:** Ton rassurant et expert

## 🔧 Intégration Technique

### Utilisation dans le Code
```typescript
// Welcome.mp3
const welcomeAudio = await audioService.getWelcomeAudio();

// CropSains.mp3  
const healthyAudio = await audioService.getHealthyCropAudio();

// CropMalade.mp3
const diseasedAudio = await audioService.getDiseasedCropAudio();
```

### Vérification des Fichiers
```bash
npm run test:services
```
Cette commande vérifiera la présence de tous les fichiers audio requis.

## 📝 Notes d'Implémentation

### Flux d'Utilisation
1. **Accueil:** `Welcome.mp3` + Menu texte
2. **Option 1 - Santé:** 
   - Image reçue → Analyse → `CropSains.mp3` OU `CropMalade.mp3` + Message texte détaillé
3. **Option 2 - Ravageurs:** 
   - Utilise les fichiers existants (`Reponse.mp3`, `Alerte.mp3`, `Incertaine.mp3`)
4. **Option 3 - Alerte:** 
   - Système d'alerte (pas d'audio spécifique pour l'instant)

### Gestion des Erreurs
- Si un fichier audio est manquant, le bot envoie un message texte de remplacement
- Les analyses continuent de fonctionner même sans les fichiers audio
- Le système log les fichiers manquants pour faciliter le debug

## 🚀 Prochaines Étapes

1. **Enregistrer les 3 nouveaux fichiers audio**
2. **Les placer dans le dossier `packages/bot/audio/`**
3. **Tester avec `npm run test:services`**
4. **Démarrer le bot et tester le flux complet**

## 📞 Support

Si vous avez des questions sur l'implémentation ou besoin d'aide pour l'enregistrement des fichiers audio, consultez la documentation du projet ou contactez l'équipe de développement.
