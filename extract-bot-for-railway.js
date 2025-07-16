const fs = require('fs');
const path = require('path');

// Script pour extraire le bot dans un dossier séparé pour Railway

const sourceDir = './packages/bot';
const targetDir = './pestalert-bot-railway';

// Créer le dossier de destination
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Fichiers et dossiers à copier
const itemsToCopy = [
  'src',
  'audio',
  'package.json',
  'tsconfig.json',
  'Dockerfile',
  'railway.json',
  '.dockerignore',
  'RAILWAY_DEPLOYMENT.md'
];

// Fonction pour copier récursivement
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copier tous les éléments
itemsToCopy.forEach(item => {
  const sourcePath = path.join(sourceDir, item);
  const targetPath = path.join(targetDir, item);
  
  if (fs.existsSync(sourcePath)) {
    console.log(`📁 Copie de ${item}...`);
    copyRecursive(sourcePath, targetPath);
  } else {
    console.log(`⚠️  ${item} n'existe pas, ignoré`);
  }
});

// Créer un README spécifique
const readmeContent = `# PestAlert WhatsApp Bot

Bot WhatsApp pour l'analyse de santé des cultures et la détection de ravageurs.

## 🚀 Déploiement sur Railway

Ce repository est optimisé pour le déploiement sur Railway.

### Déploiement rapide

1. Forkez ce repository
2. Connectez-vous à [Railway](https://railway.app)
3. Créez un nouveau projet depuis GitHub
4. Ajoutez les variables d'environnement (voir RAILWAY_DEPLOYMENT.md)
5. Déployez !

### Variables d'environnement requises

\`\`\`env
OPENEPI_BASE_URL=https://api.openepi.io
OPENEPI_AUTH_URL=https://auth.openepi.io/realms/openepi/protocol/openid-connect/token
OPENEPI_CLIENT_ID=aresgn-testpestsAPI
OPENEPI_CLIENT_SECRET=gHrAAcKkMkvEDfDijdqqBXULbqjGzlyK
WHATSAPP_SESSION_PATH=/app/sessions
NODE_ENV=production
\`\`\`

## 📱 Première connexion

Après le déploiement, consultez les logs Railway pour voir le QR code WhatsApp à scanner.

## 🔍 Health Check

\`\`\`
GET https://votre-app.railway.app/health
\`\`\`

## 📚 Documentation complète

Voir \`RAILWAY_DEPLOYMENT.md\` pour les instructions détaillées.
`;

fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent);

// Créer un .gitignore
const gitignoreContent = `node_modules/
dist/
.env
*.log
sessions/*
!sessions/.gitkeep
.DS_Store
`;

fs.writeFileSync(path.join(targetDir, '.gitignore'), gitignoreContent);

// Créer le dossier sessions avec .gitkeep
const sessionsDir = path.join(targetDir, 'sessions');
if (!fs.existsSync(sessionsDir)) {
  fs.mkdirSync(sessionsDir);
}
fs.writeFileSync(path.join(sessionsDir, '.gitkeep'), '');

console.log('✅ Extraction terminée !');
console.log(`📁 Dossier créé : ${targetDir}`);
console.log('');
console.log('🚀 Prochaines étapes :');
console.log(`1. cd ${targetDir}`);
console.log('2. git init');
console.log('3. git add .');
console.log('4. git commit -m "Initial commit for Railway deployment"');
console.log('5. Créer un repository GitHub');
console.log('6. git remote add origin <votre-repo-url>');
console.log('7. git push -u origin main');
console.log('8. Déployer sur Railway depuis ce nouveau repository');
