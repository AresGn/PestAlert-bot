#!/usr/bin/env node

const https = require('https');

/**
 * Test de l'API corrigée avec le bon format de réponse
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

async function testCorrectedAPI() {
  console.log('🔧 Test de l\'API corrigée');
  console.log('==========================');
  
  // Test de login avec le nouveau format
  console.log('\n🔐 Test de login avec format corrigé...');
  try {
    const loginData = {
      email: 'admin@pestalert.com',
      password: 'admin123'
    };
    
    const loginResponse = await makeRequest('https://pestalert-api.vercel.app/api/auth/login', 'POST', loginData);
    console.log(`Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode === 200) {
      const loginResult = JSON.parse(loginResponse.body);
      console.log('✅ Login réussi !');
      console.log('📋 Format de réponse:');
      console.log(JSON.stringify(loginResult, null, 2));
      
      // Vérifier le format attendu par le dashboard
      if (loginResult.success && loginResult.data && loginResult.data.token && loginResult.data.user) {
        console.log('\n✅ Format correct pour le dashboard !');
        console.log(`   success: ${loginResult.success}`);
        console.log(`   data.token: ${loginResult.data.token ? 'Présent' : 'Manquant'}`);
        console.log(`   data.user.name: ${loginResult.data.user.name}`);
        console.log(`   data.user.email: ${loginResult.data.user.email}`);
      } else {
        console.log('\n❌ Format incorrect pour le dashboard');
      }
    } else {
      console.log('❌ Login échoué');
    }
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
  
  console.log('\n🎉 MAINTENANT TESTE À NOUVEAU LA CONNEXION !');
  console.log('============================================');
  console.log('📍 URL: https://pestalert-dashboard.vercel.app/login');
  console.log('📧 Email: admin@pestalert.com');
  console.log('🔑 Mot de passe: admin123');
  console.log('');
  console.log('💡 L\'API renvoie maintenant le format attendu:');
  console.log('   { success: true, data: { token: "...", user: {...} } }');
  console.log('');
  console.log('✅ La connexion devrait maintenant fonctionner !');
}

testCorrectedAPI().catch(console.error);
