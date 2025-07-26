#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Script de déploiement automatisé pour Vercel
 * Déploie chaque package séparément sur Vercel
 */

const packages = [
  {
    name: 'dashboard',
    path: 'packages/dashboard',
    description: 'Dashboard Admin React',
    env: {
      'VITE_API_URL': 'https://pestalert-api.vercel.app',
      'VITE_SOCKET_URL': 'https://pestalert-api.vercel.app'
    }
  },
  {
    name: 'api',
    path: 'packages/api',
    description: 'API Backend Express',
    env: {
      'NODE_ENV': 'production',
      'CORS_ORIGIN': 'https://pestalert-dashboard.vercel.app'
    }
  },
  {
    name: 'web',
    path: 'packages/web',
    description: 'Site Web Public Next.js',
    env: {
      'NEXT_PUBLIC_API_URL': 'https://pestalert-api.vercel.app'
    }
  }
];

async function deployPackage(pkg) {
  console.log(`\n🚀 Déploiement de ${pkg.name} (${pkg.description})...`);
  console.log(`📁 Dossier: ${pkg.path}`);
  
  try {
    // Vérifier que le dossier existe
    if (!fs.existsSync(pkg.path)) {
      console.log(`❌ Dossier ${pkg.path} introuvable`);
      return false;
    }

    // Naviguer vers le dossier du package
    process.chdir(pkg.path);
    
    // Créer le fichier vercel.json si nécessaire
    const vercelConfig = createVercelConfig(pkg);
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    
    // Installer les dépendances
    console.log(`📦 Installation des dépendances...`);
    execSync('npm install', { stdio: 'inherit' });
    
    // Déployer sur Vercel
    console.log(`🌐 Déploiement sur Vercel...`);
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    
    console.log(`✅ ${pkg.name} déployé avec succès !`);
    
    // Retourner au dossier racine
    process.chdir('../../');
    
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors du déploiement de ${pkg.name}:`, error.message);
    process.chdir('../../');
    return false;
  }
}

function createVercelConfig(pkg) {
  const baseConfig = {
    name: `pestalert-${pkg.name}`,
    env: pkg.env
  };

  switch (pkg.name) {
    case 'dashboard':
      return {
        ...baseConfig,
        framework: 'vite',
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        installCommand: 'npm install'
      };
      
    case 'api':
      return {
        ...baseConfig,
        version: 2,
        functions: {
          'src/server.ts': {
            runtime: 'nodejs18.x'
          }
        },
        routes: [
          {
            src: '/(.*)',
            dest: '/src/server.ts'
          }
        ]
      };
      
    case 'web':
      return {
        ...baseConfig,
        framework: 'nextjs',
        buildCommand: 'npm run build'
      };
      
    default:
      return baseConfig;
  }
}

async function main() {
  console.log('🎯 Déploiement automatisé PestAlert sur Vercel');
  console.log('===============================================');
  
  const results = [];
  
  for (const pkg of packages) {
    const success = await deployPackage(pkg);
    results.push({ name: pkg.name, success });
  }
  
  console.log('\n📊 Résumé du déploiement:');
  console.log('========================');
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎉 ${successCount}/${results.length} packages déployés avec succès !`);
  
  if (successCount === results.length) {
    console.log('\n🌐 URLs de déploiement:');
    console.log('📊 Dashboard: https://pestalert-dashboard.vercel.app');
    console.log('🔌 API: https://pestalert-api.vercel.app');
    console.log('🌍 Web: https://pestalert-web.vercel.app');
  }
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { deployPackage, createVercelConfig };
