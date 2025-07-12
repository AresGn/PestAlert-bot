@echo off
echo ========================================
echo    🌾 PestAlert - Installation Automatique
echo ========================================
echo.
echo Ce script va configurer automatiquement
echo tout l'environnement PestAlert.
echo.
pause

echo ========================================
echo 📋 Vérification des prérequis...
echo ========================================

:: Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Node.js n'est pas installé!
    echo Téléchargez Node.js depuis: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js détecté

:: Vérifier npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: npm n'est pas installé!
    pause
    exit /b 1
)
echo ✅ npm détecté

echo.
echo ========================================
echo 📦 Installation des dépendances...
echo ========================================

echo Installation des dépendances racine...
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERREUR lors de l'installation des dépendances racine
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🔧 Configuration des variables d'environnement...
echo ========================================

:: Copier le fichier de configuration global
if not exist ".env_global" (
    echo Création du fichier .env_global...
    copy ".env_global.example" ".env_global"
    echo ⚠️  IMPORTANT: Éditez le fichier .env_global avec vos paramètres!
    echo.
)

:: Configuration pour chaque package
echo Configuration du package Core...
cd packages\core
if not exist ".env" (
    copy ".env.example" ".env"
    echo ✅ Fichier .env créé pour Core
)
cd ..\..

echo Configuration du package API...
cd packages\api
if not exist ".env" (
    copy ".env.example" ".env"
    echo ✅ Fichier .env créé pour API
)
cd ..\..

echo Configuration du package Bot...
cd packages\bot
if not exist ".env" (
    copy ".env.example" ".env"
    echo ✅ Fichier .env créé pour Bot
)
cd ..\..

echo Configuration du package Dashboard...
cd packages\dashboard
if not exist ".env" (
    copy ".env.example" ".env"
    echo ✅ Fichier .env créé pour Dashboard
)
cd ..\..

echo Configuration de l'app Web...
cd apps\web
if not exist ".env" (
    copy ".env.example" ".env"
    echo ✅ Fichier .env créé pour Web
)
cd ..\..

echo.
echo ========================================
echo 🗄️ Configuration de la base de données...
echo ========================================

echo ⚠️  Assurez-vous d'avoir configuré DATABASE_URL dans .env_global
echo.
set /p continue="Continuer avec la configuration de la base de données? (y/n): "
if /i "%continue%" neq "y" (
    echo Configuration de la base de données ignorée.
    goto :skip_db
)

echo Génération du client Prisma...
cd packages\core
call npm run db:generate
if %errorlevel% neq 0 (
    echo ❌ ERREUR lors de la génération du client Prisma
    echo Vérifiez votre DATABASE_URL dans .env_global
    cd ..\..
    goto :skip_db
)

echo Exécution des migrations...
call npm run db:migrate
if %errorlevel% neq 0 (
    echo ❌ ERREUR lors des migrations
    echo Vérifiez votre connexion à la base de données
    cd ..\..
    goto :skip_db
)

echo Initialisation avec des données de test...
call npm run db:init
if %errorlevel% neq 0 (
    echo ⚠️  Erreur lors de l'initialisation des données (optionnel)
)

cd ..\..
echo ✅ Base de données configurée avec succès!

:skip_db

echo.
echo ========================================
echo 🎉 Installation terminée!
echo ========================================
echo.
echo Prochaines étapes:
echo.
echo 1. 📝 Éditez le fichier .env_global avec vos paramètres:
echo    - DATABASE_URL (PostgreSQL)
echo    - OPENEPI_CLIENT_ID et OPENEPI_CLIENT_SECRET
echo    - JWT_SECRET (générez une clé forte)
echo.
echo 2. 🚀 Démarrez les services:
echo    start_all.bat
echo.
echo 3. 🌐 Accédez aux applications:
echo    - Dashboard: http://localhost:5173
echo    - Site Web: http://localhost:5174  
echo    - API: http://localhost:3001/health
echo.
echo 4. 📱 Pour le bot WhatsApp:
echo    start_bot.bat
echo    Puis scannez le QR code avec WhatsApp
echo.
echo ========================================
echo 📚 Documentation:
echo ========================================
echo.
echo - README.md - Guide complet
echo - packages/bot/README.md - Configuration du bot
echo - packages/dashboard/README.md - Dashboard admin
echo.
echo ⚠️  IMPORTANT: Changez tous les secrets en production!
echo.
pause
