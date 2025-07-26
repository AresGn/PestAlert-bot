#!/usr/bin/env node

const https = require('https');
const http = require('http');

/**
 * Script de test des endpoints API PestAlert
 */

const API_BASE = 'https://pestalert-db5q5zitx-ares-projects-0b0ee8dc.vercel.app';

const endpoints = [
  {
    name: 'Health Check',
    url: `${API_BASE}/api/health`,
    method: 'GET'
  },
  {
    name: 'Login Test',
    url: `${API_BASE}/api/auth/login`,
    method: 'POST',
    data: {
      email: 'admin@pestalert.com',
      password: 'admin123'
    }
  },
  {
    name: 'Dashboard Metrics',
    url: `${API_BASE}/api/dashboard/metrics`,
    method: 'GET'
  }
];

function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.url);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PestAlert-Test-Script/1.0'
      }
    };

    if (endpoint.data) {
      const postData = JSON.stringify(endpoint.data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const protocol = url.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (endpoint.data) {
      req.write(JSON.stringify(endpoint.data));
    }
    
    req.end();
  });
}

async function testEndpoint(endpoint) {
  console.log(`\n🧪 Testing: ${endpoint.name}`);
  console.log(`📍 URL: ${endpoint.url}`);
  console.log(`🔧 Method: ${endpoint.method}`);
  
  if (endpoint.data) {
    console.log(`📤 Data: ${JSON.stringify(endpoint.data)}`);
  }
  
  try {
    const response = await makeRequest(endpoint);
    
    console.log(`📊 Status: ${response.statusCode}`);
    console.log(`🔍 Headers:`, response.headers);
    
    try {
      const jsonBody = JSON.parse(response.body);
      console.log(`✅ Response:`, JSON.stringify(jsonBody, null, 2));
    } catch (e) {
      console.log(`📄 Raw Response:`, response.body);
    }
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`✅ SUCCESS`);
    } else {
      console.log(`❌ FAILED`);
    }
    
  } catch (error) {
    console.log(`❌ ERROR:`, error.message);
  }
  
  console.log('─'.repeat(60));
}

async function testAllEndpoints() {
  console.log('🎯 PestAlert API Endpoint Testing');
  console.log('='.repeat(60));
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n🏁 Testing completed!');
}

// Exécuter les tests
testAllEndpoints().catch(console.error);
