@echo off
echo ========================================
echo    PestAlert - Démarrage Dashboard
echo ========================================
echo.
echo Vérification des prérequis...
if not exist "packages\dashboard" (
    echo ERREUR: Le package Dashboard n'existe pas!
    pause
    exit /b 1
)

echo.
echo Installation des dépendances Dashboard...
cd packages\dashboard
call npm install
echo.
echo Démarrage du dashboard sur http://localhost:5173...
call npm run dev
pause
