import { Request, Response } from 'express';
import { DashboardDataService } from '@pestalert/core/src/services/dashboardDataService';

export class DashboardController {
  private dashboardService: DashboardDataService;

  constructor() {
    this.dashboardService = new DashboardDataService();
  }

  /**
   * GET /api/dashboard/metrics
   * Obtenir les métriques principales du dashboard
   */
  async getMetrics(req: Request, res: Response) {
    try {
      const metrics = await this.dashboardService.getDashboardMetrics();
      res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/analytics
   * Obtenir les statistiques d'analyses
   */
  async getAnalytics(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const analytics = await this.dashboardService.getAnalysisStats(days);
      
      res.json({
        success: true,
        data: analytics,
        period: `${days} days`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/users
   * Obtenir les statistiques d'activité des utilisateurs
   */
  async getUserActivity(req: Request, res: Response) {
    try {
      const userActivity = await this.dashboardService.getUserActivity();
      
      res.json({
        success: true,
        data: userActivity,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'activité utilisateur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/charts/usage
   * Obtenir les données pour les graphiques d'utilisation
   */
  async getUsageChartData(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const chartData = await this.generateUsageChartData(days);
      
      res.json({
        success: true,
        data: chartData,
        period: `${days} days`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la génération des données de graphique:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/charts/performance
   * Obtenir les données pour les graphiques de performance
   */
  async getPerformanceChartData(req: Request, res: Response) {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const chartData = await this.generatePerformanceChartData(hours);
      
      res.json({
        success: true,
        data: chartData,
        period: `${hours} hours`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la génération des données de performance:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/alerts
   * Obtenir la liste des alertes avec pagination
   */
  async getAlerts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const severity = req.query.severity as string;

      const alerts = await this.getAlertsWithFilters(page, limit, status, severity);
      
      res.json({
        success: true,
        data: alerts,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * POST /api/dashboard/alerts/:id/resolve
   * Marquer une alerte comme résolue
   */
  async resolveAlert(req: Request, res: Response) {
    try {
      const alertId = req.params.id;
      const { resolution, agentId } = req.body;

      // TODO: Implémenter la résolution d'alerte
      // Pour l'instant, simulation
      
      res.json({
        success: true,
        message: 'Alerte marquée comme résolue',
        alertId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la résolution d\'alerte:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/system/health
   * Vérifier la santé du système
   */
  async getSystemHealth(req: Request, res: Response) {
    try {
      const health = await this.checkSystemHealth();
      
      res.json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de la santé du système:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * Générer les données de graphique d'utilisation
   */
  private async generateUsageChartData(days: number) {
    // Simulation de données pour l'instant
    // TODO: Implémenter avec de vraies données de la base
    
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        analyses: Math.floor(Math.random() * 100) + 20,
        users: Math.floor(Math.random() * 50) + 10,
        alerts: Math.floor(Math.random() * 10) + 1
      });
    }
    
    return {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Analyses',
          data: data.map(d => d.analyses),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)'
        },
        {
          label: 'Utilisateurs',
          data: data.map(d => d.users),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        },
        {
          label: 'Alertes',
          data: data.map(d => d.alerts),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)'
        }
      ]
    };
  }

  /**
   * Générer les données de graphique de performance
   */
  private async generatePerformanceChartData(hours: number) {
    // Simulation de données pour l'instant
    // TODO: Implémenter avec de vraies données de la base
    
    const data = [];
    const now = new Date();
    
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toISOString(),
        responseTime: Math.random() * 1000 + 200,
        availability: Math.random() * 10 + 90,
        errorRate: Math.random() * 5
      });
    }
    
    return {
      labels: data.map(d => new Date(d.time).toLocaleTimeString()),
      datasets: [
        {
          label: 'Temps de réponse (ms)',
          data: data.map(d => d.responseTime),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          yAxisID: 'y'
        },
        {
          label: 'Disponibilité (%)',
          data: data.map(d => d.availability),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          yAxisID: 'y1'
        }
      ]
    };
  }

  /**
   * Obtenir les alertes avec filtres
   */
  private async getAlertsWithFilters(page: number, limit: number, status?: string, severity?: string) {
    // Simulation pour l'instant
    // TODO: Implémenter avec Prisma
    
    const alerts = [
      {
        id: '1',
        farmerId: 'farmer_1',
        farmerName: 'Amadou Diallo',
        type: 'crop_disease',
        severity: 'HIGH',
        message: 'Maladie détectée sur les tomates',
        status: 'active',
        createdAt: new Date().toISOString(),
        location: { lat: 14.6928, lon: -17.4467, city: 'Dakar' }
      },
      {
        id: '2',
        farmerId: 'farmer_2',
        farmerName: 'Fatou Sall',
        type: 'pest_infestation',
        severity: 'MEDIUM',
        message: 'Présence de pucerons',
        status: 'resolved',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: { lat: 14.7645, lon: -17.3660, city: 'Thiès' }
      }
    ];

    return {
      alerts,
      pagination: {
        page,
        limit,
        total: alerts.length,
        totalPages: Math.ceil(alerts.length / limit)
      }
    };
  }

  /**
   * Vérifier la santé du système
   */
  private async checkSystemHealth() {
    return {
      overall: 'healthy',
      services: {
        database: { status: 'healthy', responseTime: 45 },
        bot: { status: 'healthy', uptime: '99.9%' },
        api: { status: 'healthy', responseTime: 120 },
        openepi: { status: 'healthy', responseTime: 850 }
      },
      lastCheck: new Date().toISOString()
    };
  }
}
