import { Request, Response } from 'express';
import { BotDataService } from '@pestalert/core/src/services/botDataService';

export class BotDataController {
  private botDataService: BotDataService;

  constructor() {
    this.botDataService = new BotDataService();
  }

  /**
   * POST /api/dashboard/bot/user-session
   * Enregistrer une session utilisateur du bot
   */
  async recordUserSession(req: Request, res: Response) {
    try {
      const { userId, userPhone, userName, location, timestamp, botSource } = req.body;

      await this.botDataService.recordUserSession({
        userId,
        userPhone,
        userName,
        location,
        timestamp: new Date(timestamp),
        botSource: botSource || 'unknown'
      });

      res.json({
        success: true,
        message: 'Session utilisateur enregistrée',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la session utilisateur:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * POST /api/dashboard/bot/image-analysis
   * Enregistrer une analyse d'image du bot
   */
  async recordImageAnalysis(req: Request, res: Response) {
    try {
      const {
        userId,
        userPhone,
        analysisType,
        success,
        isHealthy,
        confidence,
        topDisease,
        processingTime,
        imageQuality,
        errorMessage,
        alertLevel,
        location,
        timestamp,
        botSource
      } = req.body;

      await this.botDataService.recordImageAnalysis({
        userId,
        userPhone,
        analysisType,
        success,
        isHealthy,
        confidence,
        topDisease,
        processingTime,
        imageQuality,
        errorMessage,
        alertLevel,
        location,
        timestamp: new Date(timestamp),
        botSource: botSource || 'unknown'
      });

      res.json({
        success: true,
        message: 'Analyse d\'image enregistrée',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'analyse d\'image:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * POST /api/dashboard/bot/system-metric
   * Enregistrer une métrique système du bot
   */
  async recordSystemMetric(req: Request, res: Response) {
    try {
      const { service, metric, value, unit, metadata, timestamp, botSource } = req.body;

      await this.botDataService.recordSystemMetric({
        service,
        metric,
        value,
        unit,
        metadata,
        timestamp: new Date(timestamp),
        botSource: botSource || 'unknown'
      });

      res.json({
        success: true,
        message: 'Métrique système enregistrée',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la métrique système:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * POST /api/dashboard/bot/performance-metrics
   * Enregistrer les métriques de performance du bot
   */
  async recordPerformanceMetrics(req: Request, res: Response) {
    try {
      const { metrics, timestamp, botSource } = req.body;

      await this.botDataService.recordPerformanceMetrics({
        metrics,
        timestamp: new Date(timestamp),
        botSource: botSource || 'unknown'
      });

      res.json({
        success: true,
        message: 'Métriques de performance enregistrées',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des métriques de performance:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/bot/status
   * Obtenir le statut du bot
   */
  async getBotStatus(req: Request, res: Response) {
    try {
      const status = await this.botDataService.getBotStatus();

      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du statut du bot:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * GET /api/dashboard/bot/metrics
   * Obtenir les métriques récentes du bot
   */
  async getBotMetrics(req: Request, res: Response) {
    try {
      const { hours = 24 } = req.query;
      const metrics = await this.botDataService.getBotMetrics(Number(hours));

      res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques du bot:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }
}
