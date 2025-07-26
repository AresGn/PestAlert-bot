#!/usr/bin/env node

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

/**
 * Script pour tester le mot de passe de l'admin existant
 */

const DATABASE_URL = "postgresql://neondb_owner:npg_HU4XsFtRMPa0@ep-white-field-adpx7w8i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const possiblePasswords = [
  'admin123',
  'admin',
  'password',
  'pestalert',
  'admin@pestalert.com',
  '123456',
  'pestalert123'
];

async function testAdminPassword() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connexion à la base de données...');
    await client.connect();
    
    // Récupérer l'utilisateur admin
    const userQuery = `
      SELECT id, email, name, password 
      FROM dashboard_users 
      WHERE email = 'admin@pestalert.com'
    `;
    
    const userResult = await client.query(userQuery);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Utilisateur admin non trouvé');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('👤 Utilisateur trouvé:', user.email);
    console.log('🔐 Hash du mot de passe:', user.password);
    
    // Tester différents mots de passe
    console.log('\n🧪 Test des mots de passe possibles:');
    console.log('='.repeat(50));
    
    for (const password of possiblePasswords) {
      try {
        const isValid = await bcrypt.compare(password, user.password);
        const status = isValid ? '✅ VALIDE' : '❌ Invalide';
        console.log(`${status} - "${password}"`);
        
        if (isValid) {
          console.log(`\n🎉 MOT DE PASSE TROUVÉ: "${password}"`);
          console.log('📋 Identifiants de connexion:');
          console.log(`   Email: ${user.email}`);
          console.log(`   Mot de passe: ${password}`);
          break;
        }
      } catch (error) {
        console.log(`❌ Erreur pour "${password}":`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

// Installer bcryptjs si nécessaire
console.log('📦 Vérification des dépendances...');
try {
  require('bcryptjs');
  testAdminPassword();
} catch (error) {
  console.log('❌ Module "bcryptjs" non trouvé. Installation...');
  console.log('💡 Exécutez: npm install bcryptjs');
  console.log('💡 Puis relancez ce script');
}
