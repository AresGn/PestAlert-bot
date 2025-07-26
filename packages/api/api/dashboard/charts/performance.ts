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
    const hours = parseInt(req.query.hours as string) || 24;
    
    // Générer des données de performance pour les dernières heures
    const performanceData = [];
    const now = new Date();
    
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      performanceData.push({
        time: time.toISOString(),
        responseTime: Math.floor(Math.random() * 200) + 100, // 100-300ms
        throughput: Math.floor(Math.random() * 50) + 20, // 20-70 req/min
        errorRate: Math.random() * 2, // 0-2%
        cpuUsage: Math.random() * 30 + 40, // 40-70%
        memoryUsage: Math.random() * 20 + 60 // 60-80%
      });
    }

    res.status(200).json({
      success: true,
      data: {
        labels: performanceData.map(d => d.time),
        datasets: [
          {
            label: 'Temps de réponse (ms)',
            data: performanceData.map(d => d.responseTime),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          },
          {
            label: 'Débit (req/min)',
            data: performanceData.map(d => d.throughput),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)'
          }
        ],
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
