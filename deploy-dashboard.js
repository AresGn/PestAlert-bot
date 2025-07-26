#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Script de déploiement spécifique pour le Dashboard PestAlert
 */

console.log('🎯 Déploiement du Dashboard PestAlert sur Vercel');
console.log('===============================================');

const dashboardPath = 'packages/dashboard';

async function deployDashboard() {
  try {
    // Vérifier que le dossier existe
    if (!fs.existsSync(dashboardPath)) {
      console.error(`❌ Dossier ${dashboardPath} introuvable`);
      process.exit(1);
    }

    console.log(`📁 Navigation vers ${dashboardPath}...`);
    process.chdir(dashboardPath);

    // Vérifier que les fichiers de configuration existent
    if (!fs.existsSync('vercel.json')) {
      console.error('❌ Fichier vercel.json manquant');
      process.exit(1);
    }

    console.log('📦 Installation des dépendances...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('🔨 Build du projet...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('🌐 Déploiement sur Vercel...');
    execSync('vercel --prod --yes', { stdio: 'inherit' });

    console.log('\n🎉 Dashboard déployé avec succès !');
    console.log('📊 URL: https://pestalert-dashboard.vercel.app');
    
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Configurez les variables d\'environnement dans Vercel:');
    console.log('   - VITE_API_URL (URL de votre API)');
    console.log('   - VITE_SOCKET_URL (URL de votre API pour WebSocket)');
    console.log('2. Redéployez après configuration des variables');
    console.log('3. Testez le dashboard sur l\'URL de production');

  } catch (error) {
    console.error('❌ Erreur lors du déploiement:', error.message);
    process.exit(1);
  }
}

// Vérifier que Vercel CLI est installé
try {
  execSync('vercel --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Vercel CLI n\'est pas installé');
  console.log('💡 Installez-le avec: npm install -g vercel');
  process.exit(1);
}

// Exécuter le déploiement
deployDashboard();
