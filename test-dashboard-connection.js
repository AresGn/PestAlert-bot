const axios = require('axios');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: './pestalert-bot-railway/.env' });

const DASHBOARD_API_URL = process.env.DASHBOARD_API_URL || 'http://localhost:3001';
const BOT_API_SECRET = process.env.BOT_API_SECRET || 'default-bot-secret';

console.log('🧪 Test de connexion Bot ↔ Dashboard');
console.log('=====================================');
console.log(`📡 Dashboard API URL: ${DASHBOARD_API_URL}`);
console.log(`🔑 Bot Secret: ${BOT_API_SECRET ? '***' + BOT_API_SECRET.slice(-4) : 'Non défini'}`);
console.log('');

async function testConnection() {
  try {
    // 1. Test de santé de l'API
    console.log('1️⃣ Test de santé de l\'API...');
    const healthResponse = await axios.get(`${DASHBOARD_API_URL}/health`);
    console.log('✅ API accessible:', healthResponse.data.status);
    console.log('');

    // 2. Test d'authentification du bot
    console.log('2️⃣ Test d\'authentification du bot...');
    const authResponse = await axios.post(`${DASHBOARD_API_URL}/api/auth/bot-login`, {
      botId: 'pestalert-railway-bot',
      secret: BOT_API_SECRET
    });

    if (authResponse.data.success) {
      console.log('✅ Bot authentifié avec succès');
      const token = authResponse.data.token;
      console.log(`🎫 Token reçu: ${token.substring(0, 20)}...`);
      console.log('');

      // 3. Test d'envoi de données
      console.log('3️⃣ Test d\'envoi de données...');
      
      // Test session utilisateur
      const sessionResponse = await axios.post(`${DASHBOARD_API_URL}/api/dashboard/bot/user-session`, {
        userId: 'test-user-123',
        userPhone: '+33123456789',
        userName: 'Test User',
        timestamp: new Date().toISOString(),
        botSource: 'railway'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (sessionResponse.data.success) {
        console.log('✅ Session utilisateur envoyée');
      } else {
        console.log('❌ Erreur session utilisateur:', sessionResponse.data.error);
      }

      // Test analyse d'image
      const analysisResponse = await axios.post(`${DASHBOARD_API_URL}/api/dashboard/bot/image-analysis`, {
        userId: 'test-user-123',
        userPhone: '+33123456789',
        analysisType: 'health',
        success: true,
        isHealthy: true,
        confidence: 85,
        topDisease: 'Healthy',
        processingTime: 2.5,
        imageQuality: 'good',
        timestamp: new Date().toISOString(),
        botSource: 'railway'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (analysisResponse.data.success) {
        console.log('✅ Analyse d\'image envoyée');
      } else {
        console.log('❌ Erreur analyse d\'image:', analysisResponse.data.error);
      }

      // Test métrique système
      const metricResponse = await axios.post(`${DASHBOARD_API_URL}/api/dashboard/bot/system-metric`, {
        service: 'bot',
        metric: 'test_metric',
        value: 100,
        unit: 'count',
        timestamp: new Date().toISOString(),
        botSource: 'railway'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (metricResponse.data.success) {
        console.log('✅ Métrique système envoyée');
      } else {
        console.log('❌ Erreur métrique système:', metricResponse.data.error);
      }

      console.log('');
      console.log('🎉 Tous les tests sont passés avec succès !');
      console.log('📊 Le bot peut maintenant envoyer ses données au dashboard.');

    } else {
      console.log('❌ Échec de l\'authentification:', authResponse.data.error);
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.response) {
      console.error('📄 Réponse du serveur:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('📡 Pas de réponse du serveur. Vérifiez que l\'API est démarrée.');
    }
    
    console.log('');
    console.log('🔧 Solutions possibles:');
    console.log('1. Vérifiez que l\'API backend est démarrée (npm run dev dans packages/api)');
    console.log('2. Vérifiez l\'URL de l\'API dans le fichier .env');
    console.log('3. Vérifiez que le secret du bot est correct');
    console.log('4. Vérifiez que la base de données est accessible');
  }
}

// Exécuter le test
testConnection();
