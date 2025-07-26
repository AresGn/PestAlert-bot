#!/usr/bin/env node

const https = require('https');

/**
 * Script de test spécifique pour le login du dashboard
 */

const DASHBOARD_URLS = [
  'https://pestalert-dashboard.vercel.app',
  'https://pestalert-dashboard-hobdy1d5o-ares-projects-0b0ee8dc.vercel.app'
];

const API_URL = 'https://pestalert-db5q5zitx-ares-projects-0b0ee8dc.vercel.app';

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

async function testDashboardAPI(dashboardUrl) {
  console.log(`\n🧪 Testing Dashboard: ${dashboardUrl}`);
  console.log('='.repeat(80));
  
  try {
    // 1. Test de la page de login
    console.log('\n📄 1. Testing login page...');
    const loginPageResponse = await makeRequest(`${dashboardUrl}/login`);
    console.log(`Status: ${loginPageResponse.statusCode}`);
    
    // 2. Test direct de l'API depuis le dashboard
    console.log('\n🔌 2. Testing API connection...');
    const apiResponse = await makeRequest(`${API_URL}/api/health`);
    console.log(`API Health Status: ${apiResponse.statusCode}`);
    
    if (apiResponse.statusCode === 200) {
      const healthData = JSON.parse(apiResponse.body);
      console.log(`✅ API Response:`, healthData);
    }
    
    // 3. Test de login via API
    console.log('\n🔐 3. Testing login via API...');
    const loginData = {
      email: 'admin@pestalert.com',
      password: 'admin123'
    };
    
    const loginResponse = await makeRequest(`${API_URL}/api/auth/login`, 'POST', loginData);
    console.log(`Login Status: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode === 200) {
      const loginResult = JSON.parse(loginResponse.body);
      console.log(`✅ Login Success:`, {
        success: loginResult.success,
        user: loginResult.user,
        tokenLength: loginResult.token ? loginResult.token.length : 0
      });
    } else {
      console.log(`❌ Login Failed:`, loginResponse.body);
    }
    
  } catch (error) {
    console.error(`❌ Error testing ${dashboardUrl}:`, error.message);
  }
}

async function main() {
  console.log('🎯 PestAlert Dashboard Login Testing');
  console.log('=====================================');
  
  for (const dashboardUrl of DASHBOARD_URLS) {
    await testDashboardAPI(dashboardUrl);
  }
  
  console.log('\n💡 Instructions:');
  console.log('1. Use the working dashboard URL for testing');
  console.log('2. Login credentials: admin@pestalert.com / admin123');
  console.log('3. If official URL fails, use the latest deployment URL');
}

main().catch(console.error);
