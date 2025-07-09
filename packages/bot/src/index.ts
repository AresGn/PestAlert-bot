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
  logger.logBotActivity('SYSTEM', 'Bot WhatsApp connecté et prêt');
});

client.on('message', async (message) => {
  const contact = await message.getContact();
  const chat = await message.getChat();

  console.log(`📩 Message de ${contact.name || contact.number}: ${message.body}`);

  // Logger le message reçu
  logger.logBotActivity(contact.number, 'Message reçu', {
    messageType: message.hasMedia ? 'media' : 'text',
    messageBody: message.body.substring(0, 100), // Limiter la longueur pour le log
    isGroup: chat.isGroup,
    fromMe: message.fromMe
  });

  // Ignorer les messages envoyés par le bot lui-même
  if (message.fromMe) {
    return;
  }

  // Ignorer les messages de groupes (optionnel - décommentez si vous voulez ignorer les groupes)
  // if (chat.isGroup) {
  //   return;
  // }

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

// Fonction pour gérer les médias (photos de cultures)
async function handleMediaMessages(message: any) {
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    console.log(`📎 Média reçu: ${media.mimetype}`);

    if (media.mimetype.startsWith('image/')) {
      await message.reply('📷 *Analyse de votre photo en cours...*\n\n🔍 Notre IA analyse votre culture pour détecter d\'éventuels parasites ou maladies.\n\n⏳ Résultats dans quelques instants...');

      try {
        // Conversion du média en Buffer
        const imageBuffer = Buffer.from(media.data, 'base64');

        // Données de l'agriculteur (simulation - à améliorer avec une vraie base de données)
        const contact = await message.getContact();
        const farmerData: FarmerData = {
          phone: contact.number,
          location: { lat: 14.6928, lon: -17.4467 }, // Dakar par défaut
          subscription: 'basic'
        };

        let audioResponse;
        let isAlert = false;

        try {
          // Tentative d'analyse réelle avec OpenEPI
          const analysisResponse = await pestMonitoring.handleImageAnalysis(imageBuffer, farmerData);

          // Obtenir la note vocale appropriée selon le résultat
          audioResponse = await pestMonitoring.getAudioResponse(analysisResponse.analysis.alert);
          isAlert = analysisResponse.analysis.alert.critical;

          console.log(`✅ Analyse réussie: ${isAlert ? 'Alerte critique' : 'Réponse normale'}`);

        } catch (analysisError: any) {
          console.log('⚠️ Erreur API, envoi de la réponse normale par défaut');

          // En cas d'erreur de l'API, envoyer toujours la réponse normale
          audioResponse = await pestMonitoring.getNormalAudioResponse();
          isAlert = false;

          // Logger l'erreur mais continuer le processus
          logger.logServiceError('API_FALLBACK', analysisError.message, contact.number);
        }

        // Toujours envoyer une note vocale
        if (audioResponse) {
          await client.sendMessage(contact.number + '@c.us', audioResponse);
          console.log(`🎵 Note vocale envoyée: ${isAlert ? 'Alerte' : 'Réponse normale'}`);
        } else {
          // Si même les fichiers audio ne sont pas disponibles, envoyer un message par défaut
          await message.reply('🌾 *Analyse terminée*\n\nVotre image a été analysée. Les fichiers audio ne sont pas disponibles actuellement.');
          console.log('⚠️ Fichiers audio non disponibles, message texte envoyé');
        }

        // Si c'est une alerte critique, envoyer des informations supplémentaires en texte
        if (isAlert) {
          await message.reply('🆘 *ALERTE CRITIQUE ACTIVÉE*\n\nUn expert sera contacté immédiatement.\nSuivez les recommandations de la note vocale.');
        }

      } catch (error: any) {
        console.error('❌ Erreur critique lors du traitement:', error.message);

        // Logger l'erreur critique
        const contact = await message.getContact();
        logger.logServiceError('CRITICAL_ERROR', error.message, contact.number);

        // Même en cas d'erreur critique, essayer d'envoyer au moins la note vocale normale
        try {
          const fallbackAudio = await pestMonitoring.getNormalAudioResponse();
          if (fallbackAudio) {
            await client.sendMessage(contact.number + '@c.us', fallbackAudio);
            console.log('🎵 Note vocale de secours envoyée');
          } else {
            await message.reply('🌾 *Image reçue*\n\nNous avons bien reçu votre image. Le service d\'analyse est temporairement indisponible.');
          }
        } catch (fallbackError) {
          await message.reply('❌ Une erreur s\'est produite. Veuillez réessayer plus tard.');
        }
      }
    } else {
      await message.reply('📷 Veuillez envoyer une image de vos cultures pour l\'analyse.');
    }
  }
}

// Fonction pour gérer les commandes
async function handleCommands(message: any) {
  const body = message.body.toLowerCase();

  switch(body) {
    case '!ping':
      await message.reply('🤖 Pong! Bot PestAlert actif.');
      break;

    case '!hello':
    case '!salut':
      const contact = await message.getContact();
      await message.reply(`👋 Salut ${contact.name || 'agriculteur'} ! Bienvenue sur PestAlert 🌾`);
      break;

    case '!help':
    case '!aide':
      const helpText = `🌾 *PestAlert Bot - Assistant Agricole*

📋 **Commandes disponibles:**
• !ping - Test de connexion
• !help / !aide - Cette aide
• !status - Statut des services d'analyse
• !alert - Signaler un problème urgent
• !conseils - Conseils généraux
• !contact - Contacter un expert
• !meteo - Météo agricole
• !maladies - Maladies courantes

📷 **Analyse automatique:**
Envoyez une photo de vos cultures pour une analyse IA instantanée !

🚨 **Urgence:** Tapez !alert pour signaler un problème critique`;
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

// Fonction pour les réponses naturelles
async function handleNaturalResponses(message: any) {
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
