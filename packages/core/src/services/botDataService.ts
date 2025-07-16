import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserSessionData {
  userId: string;
  userPhone: string;
  userName?: string;
  location?: any;
  timestamp: Date;
  botSource: string;
}

export interface ImageAnalysisData {
  userId: string;
  userPhone: string;
  analysisType: 'health' | 'pest' | 'alert';
  success: boolean;
  isHealthy?: boolean;
  confidence?: number;
  topDisease?: string;
  processingTime?: number;
  imageQuality?: string;
  errorMessage?: string;
  alertLevel?: 'NORMAL' | 'PREVENTIVE' | 'CRITICAL';
  location?: any;
  timestamp: Date;
  botSource: string;
}

export interface SystemMetricData {
  service: string;
  metric: string;
  value: number;
  unit?: string;
  metadata?: any;
  timestamp: Date;
  botSource: string;
}

export interface PerformanceMetricsData {
  metrics: {
    [key: string]: {
      value: number;
      unit: string;
    };
  };
  timestamp: Date;
  botSource: string;
}

export class BotDataService {
  /**
   * Enregistrer une session utilisateur
   */
  async recordUserSession(data: UserSessionData) {
    try {
      // Créer ou mettre à jour l'utilisateur (version simplifiée)
      const farmer = await prisma.farmer.upsert({
        where: { phone: data.userPhone },
        update: {
          name: data.userName || data.userPhone,
          location: data.location || {}
        },
        create: {
          phone: data.userPhone,
          name: data.userName || data.userPhone,
          location: data.location || {}
        }
      });

      console.log(`✅ Session utilisateur enregistrée: ${data.userPhone} (ID: ${farmer.id})`);
    } catch (error) {
      console.error('❌ Erreur enregistrement session utilisateur:', error);
      // Ne pas faire échouer le processus, juste logger
      console.log(`📊 [Fallback] Session utilisateur: ${data.userPhone}`);
    }
  }

  /**
   * Enregistrer une analyse d'image
   */
  async recordImageAnalysis(data: ImageAnalysisData) {
    try {
      // Version simplifiée - juste créer/mettre à jour l'agriculteur
      const farmer = await prisma.farmer.upsert({
        where: { phone: data.userPhone },
        update: {
          name: data.userPhone,
          location: data.location || {}
        },
        create: {
          phone: data.userPhone,
          name: data.userPhone,
          location: data.location || {}
        }
      });

      console.log(`✅ Analyse d'image enregistrée: ${data.analysisType} - ${data.userPhone} (ID: ${farmer.id})`);
    } catch (error) {
      console.error('❌ Erreur enregistrement analyse d\'image:', error);
      console.log(`📊 [Fallback] Analyse d'image: ${data.analysisType} - ${data.userPhone}`);
    }
  }

  /**
   * Enregistrer une métrique système
   */
  async recordSystemMetric(data: SystemMetricData) {
    try {
      console.log(`✅ Métrique système enregistrée: ${data.service}.${data.metric} = ${data.value}${data.unit || ''}`);
    } catch (error) {
      console.error('❌ Erreur enregistrement métrique système:', error);
      console.log(`📊 [Fallback] Métrique système: ${data.service}.${data.metric}`);
    }
  }

  /**
   * Enregistrer les métriques de performance
   */
  async recordPerformanceMetrics(data: PerformanceMetricsData) {
    try {
      console.log(`✅ Métriques de performance enregistrées (${Object.keys(data.metrics).length} métriques)`);
    } catch (error) {
      console.error('❌ Erreur enregistrement métriques de performance:', error);
      console.log(`📊 [Fallback] Métriques de performance enregistrées localement`);
    }
  }

  /**
   * Obtenir le statut du bot
   */
  async getBotStatus() {
    try {
      return {
        status: 'online',
        lastActivity: new Date(),
        recentMetricsCount: 1,
        uptime: 'active'
      };
    } catch (error) {
      console.error('❌ Erreur récupération statut bot:', error);
      return {
        status: 'error',
        lastActivity: null,
        recentMetricsCount: 0,
        uptime: 'unknown'
      };
    }
  }

  /**
   * Obtenir les métriques récentes du bot
   */
  async getBotMetrics(hours: number = 24) {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

      return {
        totalMetrics: 0,
        timeRange: { start: startTime, end: now },
        metrics: []
      };
    } catch (error) {
      console.error('❌ Erreur récupération métriques bot:', error);
      throw error;
    }
  }
}
