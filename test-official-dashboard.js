#!/usr/bin/env node

const https = require('https');

/**
 * Script de test pour l'URL officielle du dashboard
 * URL: https://pestalert-dashboard.vercel.app/login
 */

const OFFICIAL_DASHBOARD_URL = 'https://pestalert-dashboard.vercel.app';

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PestAlert-Test-Script/1.0',
        'Accept': 'application/json, text/plain, */*',
        'Origin': OFFICIAL_DASHBOARD_URL,
        'Referer': `${OFFICIAL_DASHBOARD_URL}/login`
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testOfficialDashboard() {
  console.log('🎯 Test du Dashboard Officiel PestAlert');
  console.log('=====================================');
  console.log(`📍 URL: ${OFFICIAL_DASHBOARD_URL}`);
  console.log('');
  
  // 1. Test de la page de login
  console.log('📄 1. Test de la page de login...');
  try {
    const loginPageResponse = await makeRequest(`${OFFICIAL_DASHBOARD_URL}/login`);
    console.log(`   Status: ${loginPageResponse.statusCode}`);
    
    if (loginPageResponse.statusCode === 200) {
      console.log('   ✅ Page de login accessible');
    } else {
      console.log('   ❌ Problème d\'accès à la page de login');
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }
  
  // 2. Test de la page principale
  console.log('\n🏠 2. Test de la page principale...');
  try {
    const homeResponse = await makeRequest(OFFICIAL_DASHBOARD_URL);
    console.log(`   Status: ${homeResponse.statusCode}`);
    
    if (homeResponse.statusCode === 200) {
      console.log('   ✅ Page principale accessible');
    } else {
      console.log('   ❌ Problème d\'accès à la page principale');
    }
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }
  
  // 3. Simulation d'une tentative de connexion
  console.log('\n🔐 3. Simulation de connexion...');
  console.log('   ⚠️  Note: Ce test simule seulement la requête, pas la vraie connexion');
  
  try {
    // Essayer de détecter l'URL de l'API utilisée par le dashboard
    console.log('   🔍 Détection de l\'URL de l\'API...');
    
    // Tester différentes URLs d'API possibles
    const possibleAPIUrls = [
      'https://pestalert-dashboard.vercel.app/api/auth/login',
      'https://pestalert-api.vercel.app/api/auth/login',
      'https://pestalert-kb99kjhkv-ares-projects-0b0ee8dc.vercel.app/api/auth/login'
    ];
    
    for (const apiUrl of possibleAPIUrls) {
      console.log(`   🧪 Test: ${apiUrl}`);
      try {
        const testResponse = await makeRequest(apiUrl, 'POST', {
          email: 'test@example.com',
          password: 'test'
        });
        
        console.log(`      Status: ${testResponse.statusCode}`);
        
        if (testResponse.statusCode === 401) {
          console.log('      ✅ API trouvée (rejette les mauvais identifiants)');
        } else if (testResponse.statusCode === 404) {
          console.log('      ❌ API non trouvée (404)');
        } else if (testResponse.statusCode === 405) {
          console.log('      ❌ Méthode non autorisée (405)');
        } else {
          console.log(`      ⚠️  Réponse inattendue: ${testResponse.statusCode}`);
        }
      } catch (error) {
        console.log(`      ❌ Erreur: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
  }
  
  console.log('\n📋 Instructions pour le test manuel:');
  console.log('=====================================');
  console.log('1. Ouvrez votre navigateur');
  console.log(`2. Allez sur: ${OFFICIAL_DASHBOARD_URL}/login`);
  console.log('3. Ouvrez les outils de développement (F12)');
  console.log('4. Allez dans l\'onglet "Network" ou "Réseau"');
  console.log('5. Essayez de vous connecter avec:');
  console.log('   - Email: admin@pestalert.com');
  console.log('   - Mot de passe: admin123');
  console.log('6. Regardez les requêtes dans l\'onglet Network pour voir:');
  console.log('   - Quelle URL d\'API est appelée');
  console.log('   - Quel est le code de réponse');
  console.log('   - S\'il y a des erreurs CORS');
  console.log('');
  console.log('💡 Si vous voyez des erreurs CORS ou 404, l\'API n\'est pas correctement configurée.');
}

testOfficialDashboard().catch(console.error);
