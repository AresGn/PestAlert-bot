import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';
import { PestMonitoringService } from './services/pestMonitoringService';
import { LoggingService } from './services/loggingService';
import { FarmerData } from './types';

dotenv.config();

// Initialisation des services
const pestMonitoring = new PestMonitoringService();
const logger = new LoggingService();

// Timestamp de démarrage du bot - IMPORTANT pour ignorer les anciens messages
const BOT_START_TIME = Date.now();
console.log(`🚀 Bot démarré à: ${new Date(BOT_START_TIME).toLocaleString()}`);
console.log(`⏰ Timestamp de démarrage: ${BOT_START_TIME}`);

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: process.env.WHATSAPP_SESSION_PATH || './sessions'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

// Événements du client
client.on('qr', (qr) => {
  console.log('📱 Scannez ce QR code avec WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot WhatsApp PestAlert connecté!');
  console.log('🔒 FILTRES DE SÉCURITÉ ACTIVÉS:');
  console.log('   - Ignore TOUS les messages de groupes');
  console.log('   - Ignore TOUS les messages du bot lui-même');
  console.log('   - Ignore TOUS les messages antérieurs au démarrage');
  console.log('   - Répond SEULEMENT aux messages privés reçus APRÈS le démarrage');
  console.log(`   - Timestamp de démarrage: ${new Date(BOT_START_TIME).toLocaleString()}`);
  logger.logBotActivity('SYSTEM', 'Bot WhatsApp connecté et prêt avec filtres de sécurité');
});

client.on('message', async (message) => {
  const contact = await message.getContact();
  const chat = await message.getChat();

  // FILTRES STRICTS - TRÈS IMPORTANT

  // 1. Ignorer TOUS les messages envoyés par le bot lui-même
  if (message.fromMe) {
    return;
  }

  // 2. Ignorer TOUS les messages de groupes
  if (chat.isGroup) {
    console.log(`🚫 Message de groupe ignoré: ${chat.name}`);
    return;
  }

  // 3. Ignorer les messages antérieurs au démarrage du bot
  const messageTimestamp = message.timestamp * 1000; // WhatsApp timestamp en secondes
  if (messageTimestamp < BOT_START_TIME) {
    console.log(`🚫 Message ancien ignoré (${new Date(messageTimestamp).toLocaleString()})`);
    return;
  }

  // 4. Vérifier que c'est bien un chat privé
  if (!chat.isGroup && !message.fromMe) {
    console.log(`📩 Message VALIDE de ${contact.name || contact.number}: ${message.body}`);

    // Logger le message reçu
    logger.logBotActivity(contact.number, 'Message reçu', {
      messageType: message.hasMedia ? 'media' : 'text',
      messageBody: message.body.substring(0, 100), // Limiter la longueur pour le log
      isGroup: chat.isGroup,
      fromMe: message.fromMe,
      timestamp: new Date(messageTimestamp).toISOString()
    });
  } else {
    console.log(`🚫 Message filtré: groupe=${chat.isGroup}, fromMe=${message.fromMe}`);
    return;
  }

  try {
    // Gérer les médias (photos) - SEULEMENT si c'est une image
    if (message.hasMedia) {
      await handleMediaMessages(message);
      return; // Sortir après avoir traité l'image
    }

    // Gérer les commandes SEULEMENT si ce n'est pas un média
    await handleCommands(message);

    // Réponses naturelles SEULEMENT si ce n'est pas un média et pas une commande
    if (!message.body.startsWith('!')) {
      await handleNaturalResponses(message);
    }
  } catch (error: any) {
    console.error('Erreur lors du traitement du message:', error);
    logger.logServiceError('MESSAGE_HANDLER', error.message, contact.number);
    await message.reply('❌ An error occurred. Please try again.');
  }
});

// Function to handle media messages (crop photos)
async function handleMediaMessages(message: any) {
  // SÉCURITÉ SUPPLÉMENTAIRE - Vérifier encore une fois
  const chat = await message.getChat();
  if (message.fromMe || chat.isGroup) {
    console.log(`🚫 SÉCURITÉ: Tentative de traitement d'un message non autorisé`);
    return;
  }

  if (message.hasMedia) {
    const media = await message.downloadMedia();
    console.log(`📎 Media received: ${media.mimetype}`);

    if (media.mimetype.startsWith('image/')) {
      await message.reply('📷 *Analyzing your crop image...*\n\n🔍 Our AI is analyzing your crop to detect potential pests or diseases.\n\n⏳ Results in a few moments...');

      try {
        // Convert media to Buffer
        const imageBuffer = Buffer.from(media.data, 'base64');

        // Farmer data (simulation - to be improved with real database)
        const contact = await message.getContact();
        const farmerData: FarmerData = {
          phone: contact.number,
          location: { lat: 14.6928, lon: -17.4467 }, // Dakar by default
          subscription: 'basic'
        };

        let audioResponse;
        let isAlert = false;

        try {
          // Attempt real analysis with OpenEPI
          const analysisResponse = await pestMonitoring.handleImageAnalysis(imageBuffer, farmerData);

          // Get appropriate audio response based on result
          audioResponse = await pestMonitoring.getAudioResponse(analysisResponse.analysis.alert);
          isAlert = analysisResponse.analysis.alert.critical;

          console.log(`✅ Analysis successful: ${isAlert ? 'Critical alert' : 'Normal response'}`);

        } catch (analysisError: any) {
          console.log('⚠️ API error, sending default normal response');

          // In case of API error, always send normal response
          audioResponse = await pestMonitoring.getNormalAudioResponse();
          isAlert = false;

          // Log error but continue process
          logger.logServiceError('API_FALLBACK', analysisError.message, contact.number);
        }

        // Always send an audio note
        if (audioResponse) {
          await client.sendMessage(contact.number + '@c.us', audioResponse);
          console.log(`🎵 Audio note sent: ${isAlert ? 'Alert' : 'Normal response'}`);
        } else {
          // If audio files are not available, send default message
          await message.reply('🌾 *Analysis completed*\n\nYour image has been analyzed. Audio files are currently unavailable.');
          console.log('⚠️ Audio files unavailable, text message sent');
        }

        // If it's a critical alert, send additional text information
        if (isAlert) {
          await message.reply('🆘 *CRITICAL ALERT ACTIVATED*\n\nAn expert will be contacted immediately.\nFollow the recommendations in the audio note.');
        }

      } catch (error: any) {
        console.error('❌ Critical error during processing:', error.message);

        // Log critical error
        const contact = await message.getContact();
        logger.logServiceError('CRITICAL_ERROR', error.message, contact.number);

        // Even in case of critical error, try to send at least the normal audio note
        try {
          const fallbackAudio = await pestMonitoring.getNormalAudioResponse();
          if (fallbackAudio) {
            await client.sendMessage(contact.number + '@c.us', fallbackAudio);
            console.log('🎵 Fallback audio note sent');
          } else {
            await message.reply('🌾 *Image received*\n\nWe have received your image. The analysis service is temporarily unavailable.');
          }
        } catch (fallbackError) {
          await message.reply('❌ An error occurred. Please try again later.');
        }
      }
    } else {
      await message.reply('📷 Please send an image of your crops for analysis.');
    }
  }
}

// Function to handle commands
async function handleCommands(message: any) {
  // SÉCURITÉ SUPPLÉMENTAIRE - Vérifier encore une fois
  const chat = await message.getChat();
  if (message.fromMe || chat.isGroup) {
    console.log(`🚫 SÉCURITÉ: Tentative de commande non autorisée`);
    return;
  }

  const body = message.body.toLowerCase();

  switch(body) {
    case '!ping':
      await message.reply('🤖 Pong! PestAlert Bot active.');
      break;

    case '!hello':
    case '!hi':
      const contact = await message.getContact();
      await message.reply(`👋 Hello ${contact.name || 'farmer'}! Welcome to PestAlert 🌾`);
      break;

    case '!help':
      const helpText = `🌾 *PestAlert Bot - Agricultural Assistant*

📋 **Available commands:**
• !ping - Connection test
• !help - This help
• !status - Analysis services status
• !alert - Report urgent problem
• !tips - General advice
• !contact - Contact an expert
• !weather - Agricultural weather
• !diseases - Common diseases

📷 **Automatic analysis:**
Send a photo of your crops for instant AI analysis!

🚨 **Emergency:** Type !alert to report a critical problem`;
      await message.reply(helpText);
      break;

    case '!status':
      try {
        await message.reply('🔍 Vérification du statut des services...');
        const servicesStatus = await pestMonitoring.checkServicesStatus();

        const statusMessage = `🔧 *Statut des Services PestAlert*

🌾 **Service d'analyse des cultures:**
${servicesStatus.cropHealth.status === 'healthy' ? '✅ Opérationnel' : '❌ Indisponible'}

🖼️ **Service de traitement d'images:**
${servicesStatus.imageProcessing ? '✅ Opérationnel' : '❌ Indisponible'}

🎵 **Fichiers audio:**
${servicesStatus.audioFiles.available ? '✅ Disponibles' : `❌ Manquants: ${servicesStatus.audioFiles.missing.join(', ')}`}

⏰ Dernière vérification: ${new Date().toLocaleString('fr-FR')}

${servicesStatus.cropHealth.status !== 'healthy' || !servicesStatus.audioFiles.available ?
  '⚠️ Certains services sont indisponibles. L\'analyse peut être limitée.' :
  '🎉 Tous les services sont opérationnels !'}`;

        await message.reply(statusMessage);
      } catch (error) {
        await message.reply('❌ Impossible de vérifier le statut des services.');
      }
      break;

    case '!alert':
      await message.reply(`🚨 *Mode Alerte Activé*

Décrivez votre problème urgent:
• Type de culture affectée
• Symptômes observés
• Étendue du problème

Un expert sera notifié immédiatement.
📞 Urgence: +33 1 XX XX XX XX`);
      break;

    case '!conseils':
      const tips = [
        "🌱 Inspectez vos cultures quotidiennement, de préférence le matin",
        "💧 Arrosez au pied des plantes pour éviter l'humidité sur les feuilles",
        "🦗 Favorisez la biodiversité pour un contrôle naturel des parasites",
        "🌡️ Surveillez les variations de température et d'humidité",
        "🔄 Pratiquez la rotation des cultures pour casser les cycles parasitaires"
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      await message.reply(`💡 *Conseil du jour:*\n\n${randomTip}`);
      break;

    case '!contact':
      await message.reply(`📞 *Contacter nos experts*

🌾 **Agronomes disponibles:**
• Dr. Martin Dubois - Maladies des céréales
• Dr. Sophie Laurent - Parasites maraîchers
• Dr. Pierre Moreau - Agriculture bio

📧 Email: experts@pestalert.com
📱 Urgence: +33 1 XX XX XX XX
🕒 Disponibilité: 8h-18h, Lun-Ven`);
      break;

    case '!meteo':
      await message.reply(`🌤️ *Météo Agricole*

📍 **Votre région:** (Localisation automatique)
🌡️ **Température:** 22°C (min: 15°C, max: 28°C)
💧 **Humidité:** 65%
🌧️ **Précipitations:** 20% de chance
💨 **Vent:** 12 km/h SO

⚠️ **Alertes:**
• Conditions favorables aux champignons
• Surveillance recommandée

🔄 Mise à jour toutes les 3h`);
      break;

    case '!maladies':
      await message.reply(`🦠 *Maladies Courantes - Saison Actuelle*

🍅 **Tomates:**
• Mildiou - Taches brunes sur feuilles
• Alternariose - Cercles concentriques

🥬 **Légumes feuilles:**
• Oïdium - Poudre blanche
• Rouille - Pustules orangées

🌾 **Céréales:**
• Septoriose - Taches allongées
• Fusariose - Jaunissement

📷 Envoyez une photo pour diagnostic précis !`);
      break;

    default:
      // Réponse pour commandes non reconnues
      if (message.body.startsWith('!')) {
        await message.reply('❌ Commande non reconnue. Tapez !help pour voir les commandes disponibles.');
      }
      break;
  }
}

// Function for natural responses
async function handleNaturalResponses(message: any) {
  // SÉCURITÉ SUPPLÉMENTAIRE - Vérifier encore une fois
  const chat = await message.getChat();
  if (message.fromMe || chat.isGroup) {
    console.log(`🚫 SÉCURITÉ: Tentative de réponse naturelle non autorisée`);
    return;
  }

  const body = message.body.toLowerCase();

  if (body.includes('bonjour') || body.includes('salut') || body.includes('hello')) {
    await message.reply('👋 Bonjour ! Je suis votre assistant PestAlert. Comment puis-je vous aider avec vos cultures aujourd\'hui ? 🌾');
  }

  if (body.includes('merci')) {
    await message.reply('😊 De rien ! N\'hésitez pas si vous avez d\'autres questions sur vos cultures.');
  }

  if (body.includes('problème') || body.includes('maladie') || body.includes('parasite')) {
    await message.reply('🔍 Je vois que vous avez un problème avec vos cultures. Envoyez-moi une photo pour que je puisse vous aider, ou tapez !alert si c\'est urgent.');
  }

  if (body.includes('photo') || body.includes('image')) {
    await message.reply('📷 Parfait ! Envoyez-moi une photo claire de la zone affectée. Je l\'analyserai immédiatement.');
  }
}

// Gestion des erreurs
client.on('auth_failure', (msg) => {
  console.error('❌ Échec de l\'authentification:', msg);
});

client.on('disconnected', (reason) => {
  console.log('📵 Client déconnecté:', reason);
});

// Démarrage du bot
client.initialize();

console.log('🤖 Démarrage du bot WhatsApp PestAlert...');
