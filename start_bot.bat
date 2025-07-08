@echo off
echo ========================================
echo    PestAlert - Démarrage Bot WhatsApp
echo ========================================
echo.
echo Vérification des prérequis...
if not exist "packages\bot" (
    echo ERREUR: Le package Bot n'existe pas!
    pause
    exit /b 1
)

echo.
echo ATTENTION: Assurez-vous que WhatsApp Web est configuré!
echo Le QR code s'affichera dans la console.
echo.
echo Installation des dépendances Bot...
cd packages\bot
call npm install
echo.
echo Démarrage du bot WhatsApp...
call npm run dev
pause
