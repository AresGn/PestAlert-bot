#!/usr/bin/env node

const { Client } = require('pg');

/**
 * Script d'exploration de la base de données Neon
 */

const DATABASE_URL = "postgresql://neondb_owner:npg_HU4XsFtRMPa0@ep-white-field-adpx7w8i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function exploreDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Connexion à la base de données Neon...');
    await client.connect();
    console.log('✅ Connexion réussie !');

    // 1. Lister toutes les tables
    console.log('\n📋 Tables existantes:');
    console.log('='.repeat(50));
    
    const tablesQuery = `
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    
    if (tablesResult.rows.length === 0) {
      console.log('❌ Aucune table trouvée dans le schéma public');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`📄 ${row.table_name} (${row.table_type})`);
      });
    }

    // 2. Pour chaque table, afficher la structure
    for (const table of tablesResult.rows) {
      console.log(`\n🔍 Structure de la table "${table.table_name}":`);
      console.log('-'.repeat(60));
      
      const columnsQuery = `
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `;
      
      const columnsResult = await client.query(columnsQuery, [table.table_name]);
      
      columnsResult.rows.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        
        console.log(`  📌 ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`);
      });

      // 3. Compter les enregistrements
      try {
        const countQuery = `SELECT COUNT(*) as count FROM "${table.table_name}"`;
        const countResult = await client.query(countQuery);
        console.log(`  📊 Nombre d'enregistrements: ${countResult.rows[0].count}`);
      } catch (error) {
        console.log(`  ⚠️  Impossible de compter les enregistrements: ${error.message}`);
      }
    }

    // 4. Vérifier s'il y a une table users
    const usersCheck = tablesResult.rows.find(table => 
      table.table_name.toLowerCase().includes('user') || 
      table.table_name.toLowerCase().includes('admin')
    );

    if (usersCheck) {
      console.log(`\n👤 Table utilisateurs trouvée: "${usersCheck.table_name}"`);
      
      // Afficher quelques exemples d'utilisateurs (sans mots de passe)
      try {
        const usersQuery = `
          SELECT * FROM "${usersCheck.table_name}" 
          LIMIT 5
        `;
        const usersResult = await client.query(usersQuery);
        
        console.log('\n📋 Exemples d\'utilisateurs:');
        usersResult.rows.forEach((user, index) => {
          console.log(`  ${index + 1}. ${JSON.stringify(user, null, 2)}`);
        });
      } catch (error) {
        console.log(`  ⚠️  Erreur lors de la lecture des utilisateurs: ${error.message}`);
      }
    } else {
      console.log('\n❌ Aucune table utilisateurs trouvée');
      console.log('💡 Nous devrons créer une table users');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Connexion fermée');
  }
}

// Installer pg si nécessaire
console.log('📦 Vérification des dépendances...');
try {
  require('pg');
  exploreDatabase();
} catch (error) {
  console.log('❌ Module "pg" non trouvé. Installation...');
  console.log('💡 Exécutez: npm install pg');
  console.log('💡 Puis relancez ce script');
}
