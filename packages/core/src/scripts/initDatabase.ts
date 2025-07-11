import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Script d'initialisation de la base de données
 * Crée les données de base nécessaires pour le dashboard
 */
async function initDatabase() {
  console.log('🚀 Initialisation de la base de données...');

  try {
    // 1. Créer un utilisateur admin par défaut
    const adminEmail = 'admin@pestalert.com';
    const adminPassword = 'admin123'; // À changer en production !
    
    const existingAdmin = await prisma.dashboardUser.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await prisma.dashboardUser.create({
        data: {
          email: adminEmail,
          name: 'Administrateur',
          role: 'admin',
          password: hashedPassword,
          isActive: true
        }
      });
      
      console.log('✅ Utilisateur admin créé:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Mot de passe: ${adminPassword}`);
      console.log('   ⚠️  CHANGEZ LE MOT DE PASSE EN PRODUCTION !');
    } else {
      console.log('ℹ️  Utilisateur admin existe déjà');
    }

    // 2. Créer quelques données de test pour le développement
    if (process.env.NODE_ENV === 'development') {
      await createTestData();
    }

    // 3. Créer les index de performance si nécessaire
    await createPerformanceIndexes();

    console.log('✅ Initialisation de la base de données terminée');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Créer des données de test pour le développement
 */
async function createTestData() {
  console.log('📊 Création de données de test...');

  // Créer quelques agriculteurs de test
  const testFarmers = [
    {
      phone: '+221701234567',
      name: 'Amadou Diallo',
      location: { lat: 14.6928, lon: -17.4467, city: 'Dakar' },
      subscriptionType: 'premium'
    },
    {
      phone: '+221702345678',
      name: 'Fatou Sall',
      location: { lat: 14.7645, lon: -17.3660, city: 'Thiès' },
      subscriptionType: 'basic'
    },
    {
      phone: '+221703456789',
      name: 'Moussa Ba',
      location: { lat: 16.0544, lon: -16.4527, city: 'Saint-Louis' },
      subscriptionType: 'basic'
    }
  ];

  for (const farmer of testFarmers) {
    await prisma.farmer.upsert({
      where: { phone: farmer.phone },
      update: {},
      create: farmer
    });
  }

  // Créer quelques sessions de test
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const testSessions = [
    {
      userId: 'user_1',
      userPhone: '+221701234567',
      userName: 'Amadou Diallo',
      state: 'IDLE',
      startTime: yesterday,
      endTime: new Date(yesterday.getTime() + 15 * 60 * 1000),
      lastActivity: yesterday,
      messageCount: 5,
      location: { lat: 14.6928, lon: -17.4467, city: 'Dakar' }
    },
    {
      userId: 'user_2',
      userPhone: '+221702345678',
      userName: 'Fatou Sall',
      state: 'MAIN_MENU',
      startTime: now,
      lastActivity: now,
      messageCount: 2,
      location: { lat: 14.7645, lon: -17.3660, city: 'Thiès' }
    }
  ];

  for (const session of testSessions) {
    // Vérifier si une session existe déjà pour cet utilisateur
    const existingSession = await prisma.botSession.findFirst({
      where: { userId: session.userId }
    });

    if (existingSession) {
      // Mettre à jour la session existante
      await prisma.botSession.update({
        where: { id: existingSession.id },
        data: session
      });
    } else {
      // Créer une nouvelle session
      await prisma.botSession.create({
        data: session
      });
    }
  }

  // Créer quelques analyses de test
  const testAnalyses = [
    {
      userId: 'user_1',
      userPhone: '+221701234567',
      analysisType: 'health',
      isHealthy: true,
      confidence: 0.85,
      topDisease: 'Healthy',
      processingTime: 2.3,
      imageQuality: 'good',
      success: true,
      alertLevel: 'NORMAL',
      createdAt: yesterday
    },
    {
      userId: 'user_2',
      userPhone: '+221702345678',
      analysisType: 'pest',
      isHealthy: false,
      confidence: 0.72,
      topDisease: 'Aphids',
      processingTime: 3.1,
      imageQuality: 'medium',
      success: true,
      alertLevel: 'PREVENTIVE',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000)
    },
    {
      userId: 'user_1',
      userPhone: '+221701234567',
      analysisType: 'health',
      isHealthy: false,
      confidence: 0.91,
      topDisease: 'Blight',
      processingTime: 1.8,
      imageQuality: 'excellent',
      success: true,
      alertLevel: 'CRITICAL',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000)
    }
  ];

  for (const analysis of testAnalyses) {
    await prisma.imageAnalysis.create({
      data: analysis
    });
  }

  // Créer quelques métriques système de test
  const services = ['bot', 'api', 'database', 'openepi'];
  const metrics = ['response_time', 'availability', 'error_rate', 'memory_usage'];

  for (let i = 0; i < 24; i++) { // 24 heures de données
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    for (const service of services) {
      for (const metric of metrics) {
        let value: number;
        let unit: string;

        switch (metric) {
          case 'response_time':
            value = Math.random() * 1000 + 100; // 100-1100ms
            unit = 'ms';
            break;
          case 'availability':
            value = Math.random() * 10 + 90; // 90-100%
            unit = '%';
            break;
          case 'error_rate':
            value = Math.random() * 5; // 0-5%
            unit = '%';
            break;
          case 'memory_usage':
            value = Math.random() * 500 + 100; // 100-600MB
            unit = 'MB';
            break;
          default:
            value = Math.random() * 100;
            unit = '';
        }

        await prisma.systemMetric.create({
          data: {
            service,
            metric,
            value,
            unit,
            timestamp
          }
        });
      }
    }
  }

  console.log('✅ Données de test créées');
}

/**
 * Créer des index de performance personnalisés si nécessaire
 */
async function createPerformanceIndexes() {
  console.log('🔧 Vérification des index de performance...');
  
  // Les index sont déjà définis dans le schema Prisma
  // Cette fonction peut être utilisée pour des index personnalisés si nécessaire
  
  console.log('✅ Index de performance vérifiés');
}

// Exécuter le script si appelé directement
if (require.main === module) {
  initDatabase()
    .catch((error) => {
      console.error('❌ Échec de l\'initialisation:', error);
      process.exit(1);
    });
}

export { initDatabase };
