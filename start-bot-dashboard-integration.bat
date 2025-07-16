@echo off
echo ========================================
echo    PestAlert - Bot Dashboard Integration
echo ========================================
echo.
echo Ce script démarre tous les services nécessaires pour tester
echo l'intégration entre le bot Railway et le dashboard admin.
echo.

echo [1/4] Vérification des fichiers de configuration...
if not exist "packages\api\.env" (
    echo ❌ Fichier packages\api\.env manquant
    echo 💡 Copiez packages\api\.env.example vers packages\api\.env
    pause
    exit /b 1
)

if not exist "packages\dashboard\.env" (
    echo ❌ Fichier packages\dashboard\.env manquant  
    echo 💡 Copiez packages\dashboard\.env.example vers packages\dashboard\.env
    pause
    exit /b 1
)

if not exist "pestalert-bot-railway\.env" (
    echo ❌ Fichier pestalert-bot-railway\.env manquant
    echo 💡 Copiez pestalert-bot-railway\.env.example vers pestalert-bot-railway\.env
    pause
    exit /b 1
)

echo ✅ Fichiers de configuration trouvés
echo.

echo [2/4] Démarrage de l'API Backend...
start "PestAlert API Backend" cmd /k "cd packages\api && npm install && npm run dev"
echo ⏳ Attente du démarrage de l'API (10 secondes)...
timeout /t 10 /nobreak >nul

echo [3/4] Test de connexion API...
node test-dashboard-connection.js
if %errorlevel% neq 0 (
    echo ❌ Test de connexion échoué
    echo 💡 Vérifiez que l'API backend est démarrée
    pause
)

echo.
echo [4/4] Démarrage des autres services...

echo Démarrage du Dashboard...
start "PestAlert Dashboard" cmd /k "cd packages\dashboard && npm install && npm run dev"
timeout /t 3 /nobreak >nul

echo Démarrage du Bot Railway...
start "PestAlert Bot Railway" cmd /k "cd pestalert-bot-railway && npm install && npm run dev"

echo.
echo ========================================
echo    🎉 Tous les services sont démarrés !
echo ========================================
echo.
echo 📊 Dashboard Admin: http://localhost:5173
echo 🔌 API Backend: http://localhost:3001
echo 🤖 Bot Railway: Voir la fenêtre du bot
echo.
echo 📋 Identifiants Dashboard:
echo    Email: admin@pestalert.com
echo    Mot de passe: admin123
echo.
echo 🧪 Pour tester la connexion:
echo    node test-dashboard-connection.js
echo.
echo ⚠️  IMPORTANT: Scannez le QR code dans la fenêtre du bot
echo    pour connecter WhatsApp avant de tester.
echo.
pause
