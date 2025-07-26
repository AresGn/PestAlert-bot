#!/usr/bin/env node

/**
 * Script de configuration des variables d'environnement Vercel
 * Configure automatiquement les variables pour chaque projet
 */

const { execSync } = require('child_process');

const projects = {
  'pestalert-dashboard': {
    env: {
      'VITE_API_URL': 'https://pestalert-api.vercel.app',
      'VITE_SOCKET_URL': 'https://pestalert-api.vercel.app'
    }
  },
  'pestalert-api': {
    env: {
      'NODE_ENV': 'production',
      'CORS_ORIGIN': 'https://pestalert-dashboard.vercel.app',
      'JWT_SECRET': 'your-super-secret-jwt-key-production',
      'BOT_API_SECRET': 'pestalert-bot-secret-production',
      'DATABASE_URL': 'your-production-database-url'
    }
  },
  'pestalert-web': {
    env: {
      'NEXT_PUBLIC_API_URL': 'https://pestalert-api.vercel.app'
    }
  }
};

function setVercelEnv(projectName, envVars) {
  console.log(`\n🔧 Configuration des variables pour ${projectName}...`);
  
  Object.entries(envVars).forEach(([key, value]) => {
    try {
      const command = `vercel env add ${key} production --scope ${projectName}`;
      console.log(`📝 Ajout de ${key}...`);
      
      // Note: Cette commande nécessite une interaction manuelle
      // En production, utilisez l'interface Vercel ou l'API
      console.log(`   Commande: ${command}`);
      console.log(`   Valeur: ${value}`);
      
    } catch (error) {
      console.error(`❌ Erreur pour ${key}:`, error.message);
    }
  });
}

function main() {
  console.log('🔐 Configuration des variables d\'environnement Vercel');
  console.log('===================================================');
  
  console.log('\n📋 Variables à configurer manuellement dans Vercel:');
  console.log('(Allez sur https://vercel.com/dashboard et configurez ces variables)');
  
  Object.entries(projects).forEach(([projectName, config]) => {
    console.log(`\n🎯 Projet: ${projectName}`);
    console.log('─'.repeat(50));
    
    Object.entries(config.env).forEach(([key, value]) => {
      const displayValue = key.includes('SECRET') || key.includes('DATABASE') 
        ? '[VALEUR_SENSIBLE]' 
        : value;
      console.log(`   ${key} = ${displayValue}`);
    });
  });
  
  console.log('\n💡 Instructions:');
  console.log('1. Allez sur https://vercel.com/dashboard');
  console.log('2. Sélectionnez chaque projet');
  console.log('3. Allez dans Settings > Environment Variables');
  console.log('4. Ajoutez les variables listées ci-dessus');
  console.log('5. Redéployez chaque projet après configuration');
}

if (require.main === module) {
  main();
}

module.exports = { projects, setVercelEnv };
