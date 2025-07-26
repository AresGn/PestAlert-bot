#!/usr/bin/env node

const https = require('https');

/**
 * Test des nouveaux endpoints du dashboard
 */

const API_BASE = 'https://pestalert-api.vercel.app';

const endpoints = [
  '/api/dashboard/metrics',
  '/api/dashboard/users', 
  '/api/dashboard/analytics',
  '/api/dashboard/alerts'
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PestAlert-Test-Script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Test des nouveaux endpoints dashboard');
  console.log('=======================================');
  
  for (const endpoint of endpoints) {
    const url = `${API_BASE}${endpoint}`;
    console.log(`\n📍 Test: ${endpoint}`);
    
    try {
      const response = await makeRequest(url);
      console.log(`   Status: ${response.statusCode}`);
      
      if (response.statusCode === 200) {
        console.log('   ✅ Endpoint fonctionnel');
        
        try {
          const data = JSON.parse(response.body);
          if (data.success) {
            console.log('   📊 Données disponibles');
          }
        } catch (e) {
          console.log('   ⚠️  Réponse non-JSON');
        }
      } else if (response.statusCode === 404) {
        console.log('   ❌ Endpoint non trouvé (404)');
      } else {
        console.log(`   ❌ Erreur: ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`   ❌ Erreur réseau: ${error.message}`);
    }
  }
  
  console.log('\n📋 Résumé:');
  console.log('- Si tous les endpoints retournent 200: ✅ Dashboard fonctionnel');
  console.log('- Si certains retournent 404: ❌ Redéploiement nécessaire');
  console.log('- Testez maintenant le dashboard: https://pestalert-dashboard.vercel.app');
}

testEndpoints().catch(console.error);
