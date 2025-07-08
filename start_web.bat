@echo off
echo ========================================
echo    PestAlert - Démarrage Site Web
echo ========================================
echo.
echo Vérification des prérequis...
if not exist "apps\web" (
    echo ERREUR: L'app Web n'existe pas!
    pause
    exit /b 1
)

echo.
echo Installation des dépendances Web...
cd apps\web
call npm install
echo.
echo Démarrage du site web sur http://localhost:5174...
call npm run dev
pause
