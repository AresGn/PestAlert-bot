#!/usr/bin/env node

const https = require('https');

/**
 * Test de la nouvelle API avec authentification base de données
 */

const API_BASE = 'https://pestalert-kb99kjhkv-ares-projects-0b0ee8dc.vercel.app';

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

async function testNewAPI() {
  console.log('🧪 Test de la nouvelle API avec base de données');
  console.log('='.repeat(60));
  
  // 1. Test Health Check
  console.log('\n📊 1. Test Health Check...');
  try {
    const healthResponse = await makeRequest(`${API_BASE}/api/health`);
    console.log(`Status: ${healthResponse.statusCode}`);
    
    if (healthResponse.statusCode === 200) {
      const healthData = JSON.parse(healthResponse.body);
      console.log('✅ Health Check OK:', healthData.message);
    } else {
      console.log('❌ Health Check Failed');
    }
  } catch (error) {
    console.log('❌ Health Check Error:', error.message);
  }
  
  // 2. Test Login avec base de données
  console.log('\n🔐 2. Test Login avec base de données...');
  try {
    const loginData = {
      email: 'admin@pestalert.com',
      password: 'admin123'
    };
    
    const loginResponse = await makeRequest(`${API_BASE}/api/auth/login`, 'POST', loginData);
    console.log(`Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode === 200) {
      const loginResult = JSON.parse(loginResponse.body);
      console.log('✅ Login réussi !');
      console.log('👤 Utilisateur:', loginResult.user.name);
      console.log('📧 Email:', loginResult.user.email);
      console.log('🎭 Rôle:', loginResult.user.role);
      console.log('🎫 Token généré:', loginResult.token ? 'Oui' : 'Non');
      
      // 3. Test avec token
      console.log('\n🎫 3. Test avec token JWT...');
      const meResponse = await makeRequest(`${API_BASE}/api/auth/me`, 'GET');
      console.log(`Status sans token: ${meResponse.statusCode}`);
      
    } else {
      const errorResult = JSON.parse(loginResponse.body);
      console.log('❌ Login échoué:', errorResult.error);
    }
  } catch (error) {
    console.log('❌ Login Error:', error.message);
  }
  
  // 4. Test avec mauvais identifiants
  console.log('\n❌ 4. Test avec mauvais identifiants...');
  try {
    const badLoginData = {
      email: 'admin@pestalert.com',
      password: 'wrongpassword'
    };
    
    const badLoginResponse = await makeRequest(`${API_BASE}/api/auth/login`, 'POST', badLoginData);
    console.log(`Status: ${badLoginResponse.statusCode}`);
    
    if (badLoginResponse.statusCode === 401) {
      console.log('✅ Rejet correct des mauvais identifiants');
    } else {
      console.log('❌ Problème de sécurité - mauvais identifiants acceptés');
    }
  } catch (error) {
    console.log('❌ Bad Login Error:', error.message);
  }
  
  console.log('\n🏁 Tests terminés !');
  console.log('\n📋 Résumé:');
  console.log('- API URL:', API_BASE);
  console.log('- Identifiants valides: admin@pestalert.com / admin123');
  console.log('- Authentification: Base de données Neon PostgreSQL');
}

testNewAPI().catch(console.error);
