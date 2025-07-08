@echo off
echo ========================================
echo    PestAlert - Démarrage API Backend
echo ========================================
echo.
echo Vérification des prérequis...
if not exist "packages\api" (
    echo ERREUR: Le package API n'existe pas!
    echo Exécutez d'abord pestalert_init_script.bat
    pause
    exit /b 1
)

echo.
echo Installation des dépendances API...
cd packages\api
call npm install
echo.
echo Démarrage de l'API sur le port 3000...
call npm run dev
pause
