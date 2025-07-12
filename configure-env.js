#!/usr/bin/env node

/**
 * 🔧 Script de Configuration Automatique des Variables d'Environnement
 * 
 * Ce script lit le fichier .env_global et configure automatiquement
 * tous les fichiers .env des packages avec les bonnes valeurs.
 */

const fs = require('fs');
const path = require('path');

// Configuration des packages et leurs variables nécessaires
const PACKAGES_CONFIG = {
  'packages/core': {
    envFile: 'packages/core/.env',
    variables: {
      'DATABASE_URL': 'DATABASE_URL',
      'JWT_SECRET': 'JWT_SECRET',
      'JWT_EXPIRES_IN': 'JWT_EXPIRES_IN',
      'REDIS_URL': 'REDIS_URL',
      'LOG_LEVEL': 'LOG_LEVEL',
      'METRICS_COLLECTION_INTERVAL': 'METRICS_COLLECTION_INTERVAL',
      'METRICS_RETENTION_DAYS': 'METRICS_RETENTION_DAYS'
    }
  },
  'packages/api': {
    envFile: 'packages/api/.env',
    variables: {
      'DATABASE_URL': 'DATABASE_URL',
      'JWT_SECRET': 'JWT_SECRET',
      'JWT_EXPIRES_IN': 'JWT_EXPIRES_IN',
      'PORT': 'API_PORT',
      'NODE_ENV': 'NODE_ENV',
      'REDIS_URL': 'REDIS_URL',
      'LOG_LEVEL': 'LOG_LEVEL',
      'CORS_ORIGIN': 'DASHBOARD_BASE_URL',
      'SOCKET_PORT': 'SOCKET_PORT'
    }
  },
  'packages/bot': {
    envFile: 'packages/bot/.env',
    variables: {
      'WHATSAPP_SESSION_PATH': 'WHATSAPP_SESSION_PATH',
      'OPENEPI_BASE_URL': 'OPENEPI_BASE_URL',
      'OPENEPI_AUTH_URL': 'OPENEPI_AUTH_URL',
      'OPENEPI_TIMEOUT': 'OPENEPI_TIMEOUT',
      'OPENEPI_CLIENT_ID': 'OPENEPI_CLIENT_ID',
      'OPENEPI_CLIENT_SECRET': 'OPENEPI_CLIENT_SECRET',
      'WHATSAPP_SESSION_SECRET': 'WHATSAPP_SESSION_SECRET',
      'LOG_LEVEL': 'LOG_LEVEL',
      'REDIS_URL': 'REDIS_URL',
      'DB_CONNECTION_STRING': 'DATABASE_URL',
      'ALERT_NOTIFICATION_WEBHOOK': 'ALERT_NOTIFICATION_WEBHOOK',
      'EMERGENCY_PHONE': 'EMERGENCY_PHONE',
      'EMERGENCY_EMAIL': 'EMERGENCY_EMAIL',
      'NODE_ENV': 'NODE_ENV',
      'DEBUG': 'DEBUG'
    }
  },
  'packages/dashboard': {
    envFile: 'packages/dashboard/.env',
    variables: {
      'VITE_API_URL': 'API_BASE_URL',
      'VITE_SOCKET_URL': 'SOCKET_URL',
      'VITE_MAP_API_KEY': 'MAP_API_KEY',
      'VITE_APP_ENV': 'NODE_ENV',
      'VITE_APP_NAME': 'VITE_APP_NAME',
      'VITE_APP_VERSION': 'VITE_APP_VERSION'
    }
  },
  'apps/web': {
    envFile: 'apps/web/.env',
    variables: {
      'VITE_API_URL': 'API_BASE_URL',
      'VITE_APP_ENV': 'NODE_ENV',
      'VITE_APP_NAME': 'VITE_APP_NAME',
      'VITE_APP_VERSION': 'VITE_APP_VERSION'
    }
  }
};

/**
 * Lit et parse le fichier .env_global
 */
function readGlobalEnv() {
  const globalEnvPath = '.env_global';
  
  if (!fs.existsSync(globalEnvPath)) {
    console.error('❌ Fichier .env_global non trouvé!');
    console.log('💡 Copiez .env_global.example vers .env_global et configurez-le.');
    process.exit(1);
  }

  const content = fs.readFileSync(globalEnvPath, 'utf8');
  const env = {};

  content.split('\n').forEach(line => {
    line = line.trim();
    
    // Ignorer les commentaires et lignes vides
    if (line.startsWith('#') || line === '') return;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });

  return env;
}

/**
 * Génère le contenu d'un fichier .env pour un package
 */
function generateEnvContent(packageName, config, globalEnv) {
  const lines = [
    `# Configuration automatique pour ${packageName}`,
    `# Généré automatiquement depuis .env_global`,
    `# Ne modifiez pas ce fichier directement, éditez .env_global à la place`,
    '',
  ];

  Object.entries(config.variables).forEach(([localKey, globalKey]) => {
    const value = globalEnv[globalKey];
    if (value !== undefined) {
      lines.push(`${localKey}="${value}"`);
    } else {
      lines.push(`# ${localKey}= # Variable ${globalKey} non trouvée dans .env_global`);
    }
  });

  lines.push('');
  lines.push('# Variables spécifiques au package (ajoutez ici si nécessaire)');
  
  return lines.join('\n');
}

/**
 * Configure tous les packages
 */
function configureAllPackages() {
  console.log('🔧 Configuration automatique des variables d\'environnement...\n');

  const globalEnv = readGlobalEnv();
  console.log(`✅ Fichier .env_global lu (${Object.keys(globalEnv).length} variables)\n`);

  let successCount = 0;
  let errorCount = 0;

  Object.entries(PACKAGES_CONFIG).forEach(([packageName, config]) => {
    try {
      // Vérifier que le dossier du package existe
      if (!fs.existsSync(packageName)) {
        console.log(`⚠️  Package ${packageName} non trouvé, ignoré`);
        return;
      }

      // Générer le contenu du .env
      const envContent = generateEnvContent(packageName, config, globalEnv);
      
      // Écrire le fichier .env
      fs.writeFileSync(config.envFile, envContent);
      
      console.log(`✅ ${config.envFile} configuré`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Erreur pour ${packageName}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n========================================');
  console.log('📊 Résumé de la configuration:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log('========================================\n');

  if (errorCount === 0) {
    console.log('🎉 Configuration terminée avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Vérifiez les fichiers .env générés');
    console.log('2. Ajustez les variables spécifiques si nécessaire');
    console.log('3. Démarrez les services avec start_all.bat');
  } else {
    console.log('⚠️  Configuration terminée avec des erreurs.');
    console.log('Vérifiez les messages d\'erreur ci-dessus.');
  }
}

/**
 * Affiche l'aide
 */
function showHelp() {
  console.log(`
🔧 Script de Configuration des Variables d'Environnement

Usage:
  node configure-env.js [options]

Options:
  --help, -h     Afficher cette aide
  --check, -c    Vérifier la configuration sans modifier les fichiers
  --force, -f    Forcer la reconfiguration même si les fichiers existent

Exemples:
  node configure-env.js              # Configuration normale
  node configure-env.js --check      # Vérification seulement
  node configure-env.js --force      # Forcer la reconfiguration

Description:
  Ce script lit le fichier .env_global et génère automatiquement
  les fichiers .env pour tous les packages du monorepo.
  
  Assurez-vous d'avoir configuré .env_global avant d'exécuter ce script.
`);
}

/**
 * Vérifie la configuration sans modifier les fichiers
 */
function checkConfiguration() {
  console.log('🔍 Vérification de la configuration...\n');

  const globalEnv = readGlobalEnv();
  console.log(`✅ Fichier .env_global lu (${Object.keys(globalEnv).length} variables)\n`);

  Object.entries(PACKAGES_CONFIG).forEach(([packageName, config]) => {
    console.log(`📦 ${packageName}:`);
    
    if (!fs.existsSync(packageName)) {
      console.log(`  ⚠️  Dossier non trouvé`);
      return;
    }

    const envExists = fs.existsSync(config.envFile);
    console.log(`  📄 Fichier .env: ${envExists ? '✅ Existe' : '❌ Manquant'}`);

    const missingVars = [];
    Object.entries(config.variables).forEach(([localKey, globalKey]) => {
      if (globalEnv[globalKey] === undefined) {
        missingVars.push(globalKey);
      }
    });

    if (missingVars.length > 0) {
      console.log(`  ⚠️  Variables manquantes dans .env_global: ${missingVars.join(', ')}`);
    } else {
      console.log(`  ✅ Toutes les variables sont disponibles`);
    }
    
    console.log('');
  });
}

// Point d'entrée principal
function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  if (args.includes('--check') || args.includes('-c')) {
    checkConfiguration();
    return;
  }

  configureAllPackages();
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = {
  readGlobalEnv,
  generateEnvContent,
  configureAllPackages,
  checkConfiguration
};
