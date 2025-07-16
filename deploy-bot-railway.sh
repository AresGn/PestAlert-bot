#!/bin/bash

# Script pour déployer le bot sur Railway depuis un monorepo

echo "🚀 Déploiement du bot WhatsApp sur Railway..."

# Vérifier si Railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI n'est pas installé. Installation..."
    npm install -g @railway/cli
fi

# Se connecter à Railway (si pas déjà fait)
echo "🔐 Connexion à Railway..."
railway login

# Créer un nouveau projet Railway
echo "📦 Création du projet Railway..."
railway init

# Configurer les variables d'environnement
echo "⚙️ Configuration des variables d'environnement..."
railway variables set OPENEPI_BASE_URL=https://api.openepi.io
railway variables set OPENEPI_AUTH_URL=https://auth.openepi.io/realms/openepi/protocol/openid-connect/token
railway variables set OPENEPI_CLIENT_ID=aresgn-testpestsAPI
railway variables set OPENEPI_CLIENT_SECRET=gHrAAcKkMkvEDfDijdqqBXULbqjGzlyK
railway variables set OPENEPI_TIMEOUT=30000
railway variables set WHATSAPP_SESSION_PATH=/app/sessions
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
railway variables set PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Déployer avec le Dockerfile personnalisé
echo "🚢 Déploiement en cours..."
railway up --dockerfile Dockerfile.bot

echo "✅ Déploiement terminé!"
echo "📱 Consultez les logs pour voir le QR code WhatsApp"
echo "🌐 URL de santé: https://votre-app.railway.app/health"
