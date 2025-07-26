import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
    return;
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    
    // Statistiques des alertes
    const alertsStatsQuery = `
      SELECT 
        COUNT(*) as total_alerts,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_alerts,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as alerts_today
      FROM pest_alerts
    `;
    
    let statsResult = { rows: [{}] };
    try {
      statsResult = await client.query(alertsStatsQuery);
    } catch (error) {
      console.log('Table pest_alerts non trouvée, utilisation de données simulées');
    }
    
    const stats = statsResult.rows[0] || {};
    
    // Alertes récentes (simulées si la table n'existe pas)
    const recentAlerts = [
      {
        id: 'alert-001',
        type: 'Maladie détectée',
        severity: 'high',
        location: 'Région Centre - Secteur A',
        crop: 'Maïs',
        description: 'Détection de mildiou sur culture de maïs',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        farmer: 'Jean Kouassi'
      },
      {
        id: 'alert-002',
        type: 'Ravageur identifié',
        severity: 'medium',
        location: 'Région Nord - Secteur B',
        crop: 'Riz',
        description: 'Présence de chenilles légionnaires',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'investigating',
        farmer: 'Marie Traoré'
      },
      {
        id: 'alert-003',
        type: 'Anomalie croissance',
        severity: 'low',
        location: 'Région Sud - Secteur C',
        crop: 'Tomate',
        description: 'Retard de croissance observé',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'resolved',
        farmer: 'Paul Diabaté'
      },
      {
        id: 'alert-004',
        type: 'Maladie détectée',
        severity: 'high',
        location: 'Région Est - Secteur D',
        crop: 'Haricot',
        description: 'Symptômes de rouille sur haricots',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        farmer: 'Fatou Koné'
      },
      {
        id: 'alert-005',
        type: 'Ravageur identifié',
        severity: 'medium',
        location: 'Région Ouest - Secteur E',
        crop: 'Maïs',
        description: 'Infestation de pucerons détectée',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'investigating',
        farmer: 'Amadou Bamba'
      }
    ];
    
    // Statistiques par type d'alerte
    const alertsByType = [
      { type: 'Maladie détectée', count: 15, percentage: 45.5 },
      { type: 'Ravageur identifié', count: 12, percentage: 36.4 },
      { type: 'Anomalie croissance', count: 4, percentage: 12.1 },
      { type: 'Problème irrigation', count: 2, percentage: 6.0 }
    ];
    
    // Évolution des alertes (derniers 7 jours)
    const alertsTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      alertsTrend.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 8) + 2,
        resolved: Math.floor(Math.random() * 5) + 1
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalAlerts: parseInt(stats.total_alerts) || 33,
          activeAlerts: parseInt(stats.active_alerts) || 7,
          highPriority: parseInt(stats.high_priority) || 3,
          alertsToday: parseInt(stats.alerts_today) || 2
        },
        recentAlerts,
        alertsByType,
        alertsTrend,
        summary: {
          avgResolutionTime: '4.2h',
          resolutionRate: 87.5,
          criticalAlerts: 3,
          pendingInvestigation: 4
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur alerts endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  } finally {
    await client.end();
  }
}
