import { PrismaClient } from '@prisma/client';

export interface DashboardMetrics {
  activeUsers: number;
  totalAnalysesToday: number;
  totalAnalysesWeek: number;
  totalAnalysesMonth: number;
  activeAlerts: number;
  resolvedAlertsToday: number;
  systemStatus: {
    bot: 'online' | 'offline' | 'error';
    api: 'online' | 'offline' | 'error';
    database: 'online' | 'offline' | 'error';
    openepi: 'online' | 'offline' | 'error';
  };
  averageResponseTime: number;
  successRate: number;
}

export interface AnalysisStats {
  total: number;
  successful: number;
  failed: number;
  byType: {
    health: number;
    pest: number;
    alert: number;
  };
  byConfidenceLevel: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface UserActivity {
  totalUsers: number;
  activeToday: number;
  activeWeek: number;
  activeMonth: number;
  newUsersToday: number;
  averageSessionDuration: number;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

/**
 * Service pour collecter et agréger les données du dashboard
 */
export class DashboardDataService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Obtenir les métriques principales du dashboard
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Utilisateurs actifs (sessions dans les dernières 24h)
    const activeUsers = await this.prisma.botSession.count({
      where: {
        lastActivity: {
          gte: today
        }
      }
    });

    // Analyses d'images
    const [analysesToday, analysesWeek, analysesMonth] = await Promise.all([
      this.prisma.imageAnalysis.count({
        where: { createdAt: { gte: today } }
      }),
      this.prisma.imageAnalysis.count({
        where: { createdAt: { gte: weekAgo } }
      }),
      this.prisma.imageAnalysis.count({
        where: { createdAt: { gte: monthAgo } }
      })
    ]);

    // Alertes
    const [activeAlerts, resolvedAlertsToday] = await Promise.all([
      this.prisma.alert.count({
        where: { status: 'active' }
      }),
      this.prisma.alert.count({
        where: {
          status: 'resolved',
          createdAt: { gte: today }
        }
      })
    ]);

    // Métriques de performance
    const recentMetrics = await this.prisma.systemMetric.findMany({
      where: {
        timestamp: {
          gte: new Date(now.getTime() - 60 * 60 * 1000) // Dernière heure
        }
      },
      orderBy: { timestamp: 'desc' }
    });

    // Calculer le statut des services
    const systemStatus = this.calculateSystemStatus(recentMetrics);
    
    // Temps de réponse moyen
    const responseTimeMetrics = recentMetrics.filter(m => m.metric === 'response_time');
    const averageResponseTime = responseTimeMetrics.length > 0
      ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length
      : 0;

    // Taux de succès
    const successfulAnalyses = await this.prisma.imageAnalysis.count({
      where: {
        createdAt: { gte: today },
        success: true
      }
    });
    const successRate = analysesToday > 0 ? (successfulAnalyses / analysesToday) * 100 : 100;

    return {
      activeUsers,
      totalAnalysesToday: analysesToday,
      totalAnalysesWeek: analysesWeek,
      totalAnalysesMonth: analysesMonth,
      activeAlerts,
      resolvedAlertsToday,
      systemStatus,
      averageResponseTime,
      successRate
    };
  }

  /**
   * Obtenir les statistiques d'analyses
   */
  async getAnalysisStats(days: number = 30): Promise<AnalysisStats> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const analyses = await this.prisma.imageAnalysis.findMany({
      where: {
        createdAt: { gte: since }
      }
    });

    const total = analyses.length;
    const successful = analyses.filter(a => a.success).length;
    const failed = total - successful;

    const byType = {
      health: analyses.filter(a => a.analysisType === 'health').length,
      pest: analyses.filter(a => a.analysisType === 'pest').length,
      alert: analyses.filter(a => a.analysisType === 'alert').length
    };

    const byConfidenceLevel = {
      high: analyses.filter(a => a.confidence && a.confidence >= 0.7).length,
      medium: analyses.filter(a => a.confidence && a.confidence >= 0.3 && a.confidence < 0.7).length,
      low: analyses.filter(a => a.confidence && a.confidence < 0.3).length
    };

    return {
      total,
      successful,
      failed,
      byType,
      byConfidenceLevel
    };
  }

  /**
   * Obtenir les statistiques d'activité des utilisateurs
   */
  async getUserActivity(): Promise<UserActivity> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Compter les utilisateurs uniques
    const [totalUsers, activeToday, activeWeek, activeMonth, newUsersToday] = await Promise.all([
      this.prisma.botSession.groupBy({
        by: ['userId'],
        _count: { userId: true }
      }).then(result => result.length),

      this.prisma.botSession.groupBy({
        by: ['userId'],
        where: { lastActivity: { gte: today } },
        _count: { userId: true }
      }).then(result => result.length),

      this.prisma.botSession.groupBy({
        by: ['userId'],
        where: { lastActivity: { gte: weekAgo } },
        _count: { userId: true }
      }).then(result => result.length),

      this.prisma.botSession.groupBy({
        by: ['userId'],
        where: { lastActivity: { gte: monthAgo } },
        _count: { userId: true }
      }).then(result => result.length),

      this.prisma.botSession.groupBy({
        by: ['userId'],
        where: { createdAt: { gte: today } },
        _count: { userId: true }
      }).then(result => result.length)
    ]);

    // Calculer la durée moyenne des sessions
    const completedSessions = await this.prisma.botSession.findMany({
      where: {
        endTime: { not: null },
        createdAt: { gte: weekAgo }
      },
      select: {
        startTime: true,
        endTime: true
      }
    });

    const averageSessionDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum, session) => {
          const duration = session.endTime!.getTime() - session.startTime.getTime();
          return sum + duration;
        }, 0) / completedSessions.length / 1000 / 60 // en minutes
      : 0;

    // Top locations (simulé pour l'instant)
    const topLocations = [
      { location: 'Dakar', count: Math.floor(activeToday * 0.4) },
      { location: 'Thiès', count: Math.floor(activeToday * 0.25) },
      { location: 'Saint-Louis', count: Math.floor(activeToday * 0.15) },
      { location: 'Kaolack', count: Math.floor(activeToday * 0.1) },
      { location: 'Autres', count: Math.floor(activeToday * 0.1) }
    ];

    return {
      totalUsers,
      activeToday,
      activeWeek,
      activeMonth,
      newUsersToday,
      averageSessionDuration,
      topLocations
    };
  }

  /**
   * Enregistrer une session bot
   */
  async recordBotSession(userId: string, userPhone: string, userName?: string, location?: any) {
    return await this.prisma.botSession.upsert({
      where: { userId },
      update: {
        lastActivity: new Date(),
        messageCount: { increment: 1 }
      },
      create: {
        userId,
        userPhone,
        userName,
        state: 'IDLE',
        startTime: new Date(),
        lastActivity: new Date(),
        messageCount: 1,
        location
      }
    });
  }

  /**
   * Enregistrer une analyse d'image
   */
  async recordImageAnalysis(data: {
    userId: string;
    userPhone: string;
    analysisType: string;
    isHealthy?: boolean;
    confidence?: number;
    topDisease?: string;
    processingTime?: number;
    imageQuality?: string;
    success: boolean;
    errorMessage?: string;
    alertLevel?: string;
    location?: any;
  }) {
    return await this.prisma.imageAnalysis.create({
      data: {
        ...data,
        createdAt: new Date()
      }
    });
  }

  /**
   * Enregistrer une métrique système
   */
  async recordSystemMetric(service: string, metric: string, value: number, unit?: string, metadata?: any) {
    return await this.prisma.systemMetric.create({
      data: {
        service,
        metric,
        value,
        unit,
        metadata,
        timestamp: new Date()
      }
    });
  }

  /**
   * Calculer le statut des services basé sur les métriques récentes
   */
  private calculateSystemStatus(metrics: any[]): DashboardMetrics['systemStatus'] {
    const services = ['bot', 'api', 'database', 'openepi'];
    const status: any = {};

    for (const service of services) {
      const serviceMetrics = metrics.filter(m => m.service === service);
      
      if (serviceMetrics.length === 0) {
        status[service] = 'offline';
        continue;
      }

      // Vérifier les métriques d'erreur
      const errorMetrics = serviceMetrics.filter(m => m.metric === 'error_rate');
      const availabilityMetrics = serviceMetrics.filter(m => m.metric === 'availability');

      if (errorMetrics.some(m => m.value > 10) || availabilityMetrics.some(m => m.value < 90)) {
        status[service] = 'error';
      } else {
        status[service] = 'online';
      }
    }

    return status;
  }

  /**
   * Nettoyer les anciennes données (à exécuter périodiquement)
   */
  async cleanupOldData(daysToKeep: number = 90) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    await Promise.all([
      this.prisma.systemMetric.deleteMany({
        where: { timestamp: { lt: cutoffDate } }
      }),
      this.prisma.botActivityLog.deleteMany({
        where: { timestamp: { lt: cutoffDate } }
      }),
      this.prisma.botSession.deleteMany({
        where: {
          createdAt: { lt: cutoffDate },
          endTime: { not: null }
        }
      })
    ]);
  }

  /**
   * Fermer la connexion Prisma
   */
  async disconnect() {
    await this.prisma.$disconnect();
  }
}
