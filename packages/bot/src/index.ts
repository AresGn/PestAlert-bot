import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

dotenv.config();

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
});

client.on('message', async (message) => {
  const contact = await message.getContact();
  const chat = await message.getChat();

  console.log(`📩 Message de ${contact.name || contact.number}: ${message.body}`);

  try {
    // Gérer les médias (photos)
    await handleMediaMessages(message);

    // Gérer les commandes
    await handleCommands(message);

    // Réponses naturelles
    await handleNaturalResponses(message);
  } catch (error) {
    console.error('Erreur lors du traitement du message:', error);
    await message.reply('❌ Une erreur s\'est produite. Veuillez réessayer.');
  }
});

// Fonction pour gérer les médias (photos de cultures)
async function handleMediaMessages(message: any) {
  if (message.hasMedia) {
    const media = await message.downloadMedia();
    console.log(`📎 Média reçu: ${media.mimetype}`);

    if (media.mimetype.startsWith('image/')) {
      await message.reply('📷 *Analyse de votre photo en cours...*\n\n🔍 Notre IA analyse votre culture pour détecter d\'éventuels parasites ou maladies.\n\n⏳ Résultats dans quelques instants...');

      // Simulation d'analyse (à remplacer par une vraie API d'analyse)
      setTimeout(async () => {
        const analysisResult = `🌾 *Résultats d'analyse PestAlert*

📊 **Culture détectée:** Tomate
🔍 **État général:** Bon
⚠️ **Alertes détectées:**
• Légères taches sur feuilles (possibles champignons)
• Recommandation: Surveillance accrue

💡 **Conseils:**
• Améliorer la ventilation
• Réduire l'humidité
• Traitement préventif bio recommandé

📞 Contactez un expert si les symptômes persistent.`;

        await message.reply(analysisResult);
      }, 3000);
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
