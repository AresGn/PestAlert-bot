import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: process.env.WHATSAPP_SESSION_PATH || './sessions'
  })
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
  if (message.body === '!ping') {
    message.reply('🤖 Pong! Bot PestAlert actif.');
  }

  if (message.body === '!help') {
    const helpText = `🌾 *PestAlert Bot*

Commandes disponibles:
• !ping - Test de connexion
• !help - Afficher cette aide
• !alert - Signaler un problème

Envoyez une photo de vos cultures pour analyse automatique.`;
    message.reply(helpText);
  }
});

// Démarrage du bot
client.initialize();

console.log('🤖 Démarrage du bot WhatsApp PestAlert...');
