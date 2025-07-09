# Guide : Créer un Bot WhatsApp Interactif avec whatsapp-web.js

## Prérequis

- Node.js v18+ installé
- Un compte WhatsApp avec accès à WhatsApp Web
- Un éditeur de code (VS Code recommandé)

## 1. Installation et Configuration

### Créer un nouveau projet
```bash
mkdir mon-bot-whatsapp
cd mon-bot-whatsapp
npm init -y
```

### Installer les dépendances
```bash
npm install whatsapp-web.js
npm install qrcode-terminal  # Pour afficher le QR code dans le terminal
```

## 2. Code de Base du Bot

### Fichier principal (app.js)
```javascript
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Créer une instance du client avec authentification locale
const client = new Client({
    authStrategy: new LocalAuth()
});

// Événement QR Code - Scanner avec votre téléphone
client.on('qr', (qr) => {
    console.log('📱 Scannez ce QR code avec votre téléphone WhatsApp :');
    qrcode.generate(qr, { small: true });
});

// Événement prêt - Bot connecté
client.on('ready', () => {
    console.log('✅ Bot WhatsApp prêt !');
});

// Événement message - Logique du bot
client.on('message', async (msg) => {
    const contact = await msg.getContact();
    const chat = await msg.getChat();
    
    console.log(`📩 Message de ${contact.name || contact.number}: ${msg.body}`);
    
    // Répondre aux commandes
    await handleCommands(msg);
});

// Fonction pour gérer les commandes
async function handleCommands(msg) {
    const body = msg.body.toLowerCase();
    
    switch(body) {
        case '!ping':
            await msg.reply('🏓 Pong !');
            break;
            
        case '!hello':
            const contact = await msg.getContact();
            await msg.reply(`👋 Salut ${contact.name || 'ami'} !`);
            break;
            
        case '!help':
            await msg.reply(`🤖 **Commandes disponibles :**
            
• !ping - Test de connexion
• !hello - Salutation
• !time - Heure actuelle
• !joke - Blague aléatoire
• !info - Informations du chat
• !help - Cette aide`);
            break;
            
        case '!time':
            const now = new Date().toLocaleString('fr-FR');
            await msg.reply(`⏰ Il est actuellement : ${now}`);
            break;
            
        case '!joke':
            const jokes = [
                "Pourquoi les poissons n'aiment pas jouer au tennis ? Parce qu'ils ont peur du filet !",
                "Que dit un escargot quand il croise une limace ? Regarde le nudiste !",
                "Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tombent dans le bateau !",
                "Qu'est-ce qui est jaune et qui attend ? Jonathan !",
                "Pourquoi les poules ne peuvent pas envoyer d'e-mails ? Parce qu'elles font cot cot cot !"
            ];
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            await msg.reply(`😄 ${randomJoke}`);
            break;
            
        case '!info':
            const chat = await msg.getChat();
            const contact = await msg.getContact();
            
            let info = `📊 **Informations du chat :**
            
• Nom : ${chat.name || 'Chat privé'}
• Type : ${chat.isGroup ? 'Groupe' : 'Privé'}
• Participants : ${chat.participants ? chat.participants.length : 2}`;
            
            if (chat.isGroup) {
                info += `
• Créé par : ${chat.owner || 'Inconnu'}`;
            }
            
            await msg.reply(info);
            break;
            
        default:
            // Réponse automatique pour les messages non reconnus
            if (msg.body.startsWith('!')) {
                await msg.reply('❌ Commande non reconnue. Tapez !help pour voir les commandes disponibles.');
            }
            break;
    }
}

// Gestion des erreurs
client.on('auth_failure', (msg) => {
    console.error('❌ Échec de l\'authentification:', msg);
});

client.on('disconnected', (reason) => {
    console.log('📵 Client déconnecté:', reason);
});

// Initialiser le client
client.initialize();
```

## 3. Fonctionnalités Avancées

### Gestion des médias
```javascript
// Ajouter cette fonction dans votre code
async function handleMediaMessages(msg) {
    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        console.log(`📎 Média reçu: ${media.mimetype}`);
        
        // Envoyer une réponse avec le média
        await msg.reply('📷 Merci pour le média !');
    }
}

// Appeler cette fonction dans l'événement message
client.on('message', async (msg) => {
    await handleMediaMessages(msg);
    await handleCommands(msg);
});
```

### Réponses automatiques intelligentes
```javascript
// Ajouter cette fonction pour des réponses plus naturelles
async function handleNaturalResponses(msg) {
    const body = msg.body.toLowerCase();
    
    if (body.includes('bonjour') || body.includes('salut')) {
        await msg.reply('👋 Salut ! Comment ça va ?');
    }
    
    if (body.includes('merci')) {
        await msg.reply('😊 De rien ! Je suis là pour aider.');
    }
    
    if (body.includes('comment ça va') || body.includes('ça va')) {
        await msg.reply('🤖 Je vais bien, merci ! Et toi ?');
    }
}
```

## 4. Lancer le Bot

### Exécuter le bot
```bash
node app.js
```

### Première connexion
1. Lancez le bot avec `node app.js`
2. Un QR code apparaîtra dans le terminal
3. Ouvrez WhatsApp sur votre téléphone
4. Allez dans **Paramètres** > **Appareils connectés** > **Connecter un appareil**
5. Scannez le QR code
6. Le bot sera connecté et prêt !

## 5. Commandes Disponibles

Une fois le bot actif, vous pouvez utiliser ces commandes :

- `!ping` - Test de connexion
- `!hello` - Salutation personnalisée
- `!time` - Affiche l'heure actuelle
- `!joke` - Blague aléatoire
- `!info` - Informations sur le chat
- `!help` - Liste des commandes

## 6. Personnalisation

### Ajouter de nouvelles commandes
```javascript
case '!weather':
    await msg.reply('🌤️ Fonctionnalité météo à venir !');
    break;

case '!quote':
    const quotes = [
        "La vie est ce qui arrive quand vous êtes occupé à faire d'autres projets. - John Lennon",
        "Le succès c'est d'aller d'échec en échec sans perdre son enthousiasme. - Winston Churchill"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    await msg.reply(`💭 ${randomQuote}`);
    break;
```

### Sauvegarder la session
Le bot utilise `LocalAuth` pour sauvegarder automatiquement la session. Vous n'aurez pas besoin de rescanner le QR code à chaque redémarrage.

## 7. Conseils et Bonnes Pratiques

### Gestion des erreurs
```javascript
client.on('message', async (msg) => {
    try {
        await handleCommands(msg);
    } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
        await msg.reply('❌ Une erreur s\'est produite. Veuillez réessayer.');
    }
});
```

### Limitations et avertissements
- WhatsApp peut bloquer les bots non officiels
- Respectez les conditions d'utilisation de WhatsApp
- Évitez le spam et les messages automatiques excessifs
- Testez d'abord avec un petit nombre de contacts

## 8. Déploiement

### Utiliser PM2 pour la production
```bash
npm install -g pm2
pm2 start app.js --name "whatsapp-bot"
pm2 save
pm2 startup
```

Votre bot WhatsApp interactif est maintenant prêt ! Il peut répondre aux commandes, gérer les médias et maintenir des conversations naturelles.