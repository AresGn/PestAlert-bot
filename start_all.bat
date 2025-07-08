@echo off
echo ========================================
echo    PestAlert - Démarrage de tous les services
echo ========================================
echo.
echo Démarrage de l'API, du Dashboard et du Site Web...
echo.
echo [1/3] Démarrage de l'API Backend...
start "PestAlert API" cmd /k "cd packages\api && npm install && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Démarrage du Dashboard...
start "PestAlert Dashboard" cmd /k "cd packages\dashboard && npm install && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Démarrage du Site Web...
start "PestAlert Web" cmd /k "cd apps\web && npm install && npm run dev"

echo.
echo ========================================
echo    Tous les services sont en cours de démarrage...
echo ========================================
echo.
echo 🌐 URLs disponibles:
echo - API Backend: http://localhost:3000
echo - Dashboard: http://localhost:5173
echo - Site Web: http://localhost:5174
echo.
echo Vérifiez les fenêtres ouvertes pour voir les logs.
echo.
echo Pour démarrer le bot WhatsApp, utilisez: start_bot.bat
echo.
pause
