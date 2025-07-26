import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const days = parseInt(req.query.days as string) || 7;
    
    // Générer des données d'utilisation pour les derniers jours
    const usageData = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      
      usageData.push({
        date: date.toISOString().split('T')[0],
        day: dayName,
        analyses: Math.floor(Math.random() * 50) + 10, // 10-60 analyses
        users: Math.floor(Math.random() * 30) + 20, // 20-50 utilisateurs
        alerts: Math.floor(Math.random() * 10) + 2, // 2-12 alertes
        sessions: Math.floor(Math.random() * 40) + 30 // 30-70 sessions
      });
    }

    res.status(200).json({
      success: true,
      data: {
        labels: usageData.map(d => d.day),
        datasets: [
          {
            label: 'Analyses',
            data: usageData.map(d => d.analyses),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
          },
          {
            label: 'Utilisateurs actifs',
            data: usageData.map(d => d.users),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true
          },
          {
            label: 'Alertes',
            data: usageData.map(d => d.alerts),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true
          }
        ],
        rawData: usageData,
        timestamp: new Date().toISOString()
      }
    });
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
