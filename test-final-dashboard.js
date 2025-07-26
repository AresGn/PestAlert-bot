#!/usr/bin/env node

const https = require('https');

/**
 * Test final du dashboard avec les bonnes variables d'environnement
 */

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
        'User-Agent': 'PestAlert-Test-Script/1.0'
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

async function testFinalDashboard() {
  console.log('🎯 Test Final du Dashboard PestAlert');
  console.log('====================================');
  
  // Test de l'API officielle
  console.log('\n🔌 1. Test de l\'API officielle...');
  try {
    const apiHealthResponse = await makeRequest('https://pestalert-api.vercel.app/api/health');
    console.log(`   Status: ${apiHealthResponse.statusCode}`);
    
    if (apiHealthResponse.statusCode === 200) {
      const healthData = JSON.parse(apiHealthResponse.body);
      console.log('   ✅ API officielle fonctionne:', healthData.message);
    }
  } catch (error) {
    console.log(`   ❌ Erreur API: ${error.message}`);
  }
  
  // Test de login sur l'API officielle
  console.log('\n🔐 2. Test de login sur l\'API officielle...');
  try {
    const loginData = {
      email: 'admin@pestalert.com',
      password: 'admin123'
    };
    
    const loginResponse = await makeRequest('https://pestalert-api.vercel.app/api/auth/login', 'POST', loginData);
    console.log(`   Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode === 200) {
      const loginResult = JSON.parse(loginResponse.body);
      console.log('   ✅ Login API réussi !');
      console.log(`   👤 Utilisateur: ${loginResult.user.name}`);
      console.log(`   🎫 Token: ${loginResult.token ? 'Généré' : 'Manquant'}`);
    } else {
      console.log('   ❌ Login API échoué');
    }
  } catch (error) {
    console.log(`   ❌ Erreur login: ${error.message}`);
  }
  
  // Test du dashboard officiel
  console.log('\n📊 3. Test du dashboard officiel...');
  try {
    const dashboardResponse = await makeRequest('https://pestalert-dashboard.vercel.app');
    console.log(`   Status: ${dashboardResponse.statusCode}`);
    
    if (dashboardResponse.statusCode === 200) {
      console.log('   ✅ Dashboard accessible');
    }
  } catch (error) {
    console.log(`   ❌ Erreur dashboard: ${error.message}`);
  }
  
  console.log('\n🎉 MAINTENANT TESTE LA CONNEXION !');
  console.log('==================================');
  console.log('📍 URL: https://pestalert-dashboard.vercel.app/login');
  console.log('📧 Email: admin@pestalert.com');
  console.log('🔑 Mot de passe: admin123');
  console.log('');
  console.log('💡 Le dashboard devrait maintenant appeler:');
  console.log('   https://pestalert-api.vercel.app/api/auth/login');
  console.log('   (et non plus sa propre URL)');
  console.log('');
  console.log('🔍 Dans les outils de développement, tu devrais voir:');
  console.log('   - POST vers https://pestalert-api.vercel.app/api/auth/login');
  console.log('   - Status 200 (succès) ou 401 (mauvais identifiants)');
  console.log('   - Pas de Status 405 (Method Not Allowed)');
}

testFinalDashboard().catch(console.error);
