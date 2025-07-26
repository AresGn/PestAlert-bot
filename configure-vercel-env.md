# Configuration des Variables d'Environnement Vercel

## 🎯 Problème identifié :
Le dashboard ne peut pas se connecter à l'API car les variables d'environnement ne sont pas configurées dans Vercel.

## 🔧 Solution : Configuration manuelle dans Vercel

### 1. Dashboard (pestalert-dashboard)
Allez sur https://vercel.com/dashboard et configurez ces variables :

**Projet : pestalert-dashboard**
- `VITE_API_URL` = `https://pestalert-db5q5zitx-ares-projects-0b0ee8dc.vercel.app`
- `VITE_SOCKET_URL` = `https://pestalert-db5q5zitx-ares-projects-0b0ee8dc.vercel.app`

### 2. API (pestalert-api)
**Projet : pestalert-api**
- `JWT_SECRET` = `pestalert-super-secret-jwt-key-2024`
- `NODE_ENV` = `production`

## 📋 Étapes :
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez le projet `pestalert-dashboard`
3. Allez dans Settings > Environment Variables
4. Ajoutez les variables ci-dessus
5. Redéployez le projet
6. Répétez pour `pestalert-api`

## 🧪 Test après configuration :
- Dashboard : https://pestalert-dashboard.vercel.app
- API Health : https://pestalert-db5q5zitx-ares-projects-0b0ee8dc.vercel.app/api/health
- Login : admin@pestalert.com / admin123
