import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { BotDataController } from '../controllers/botDataController';
import { authMiddleware } from '../middleware/auth';
import { botAuthMiddleware } from '../middleware/botAuth';
import { validateRequest } from '../middleware/validation';
import { body, query } from 'express-validator';

const router = Router();
const dashboardController = new DashboardController();
const botDataController = new BotDataController();

/**
 * @route GET /api/dashboard/metrics
 * @desc Obtenir les métriques principales du dashboard
 * @access Private (Admin)
 */
router.get('/metrics', authMiddleware, dashboardController.getMetrics.bind(dashboardController));

/**
 * @route GET /api/dashboard/analytics
 * @desc Obtenir les statistiques d'analyses
 * @access Private (Admin)
 */
router.get('/analytics', [
  authMiddleware,
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
  validateRequest
], dashboardController.getAnalytics.bind(dashboardController));

/**
 * @route GET /api/dashboard/users
 * @desc Obtenir les statistiques d'activité des utilisateurs
 * @access Private (Admin)
 */
router.get('/users', authMiddleware, dashboardController.getUserActivity.bind(dashboardController));

/**
 * @route GET /api/dashboard/charts/usage
 * @desc Obtenir les données pour les graphiques d'utilisation
 * @access Private (Admin)
 */
router.get('/charts/usage', [
  authMiddleware,
  query('days').optional().isInt({ min: 1, max: 90 }).withMessage('Days must be between 1 and 90'),
  validateRequest
], dashboardController.getUsageChartData.bind(dashboardController));

/**
 * @route GET /api/dashboard/charts/performance
 * @desc Obtenir les données pour les graphiques de performance
 * @access Private (Admin)
 */
router.get('/charts/performance', [
  authMiddleware,
  query('hours').optional().isInt({ min: 1, max: 168 }).withMessage('Hours must be between 1 and 168'),
  validateRequest
], dashboardController.getPerformanceChartData.bind(dashboardController));

/**
 * @route GET /api/dashboard/alerts
 * @desc Obtenir la liste des alertes avec pagination
 * @access Private (Admin)
 */
router.get('/alerts', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'resolved', 'pending']).withMessage('Invalid status'),
  query('severity').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).withMessage('Invalid severity'),
  validateRequest
], dashboardController.getAlerts.bind(dashboardController));

/**
 * @route POST /api/dashboard/alerts/:id/resolve
 * @desc Marquer une alerte comme résolue
 * @access Private (Admin)
 */
router.post('/alerts/:id/resolve', [
  authMiddleware,
  body('resolution').notEmpty().withMessage('Resolution is required'),
  body('agentId').optional().isString().withMessage('Agent ID must be a string'),
  validateRequest
], dashboardController.resolveAlert.bind(dashboardController));

/**
 * @route GET /api/dashboard/system/health
 * @desc Vérifier la santé du système
 * @access Private (Admin)
 */
router.get('/system/health', authMiddleware, dashboardController.getSystemHealth.bind(dashboardController));

// ========================================
// ROUTES BOT DATA (pour recevoir les données du bot Railway)
// ========================================

/**
 * @route POST /api/dashboard/bot/user-session
 * @desc Recevoir les données de session utilisateur du bot
 * @access Private (Bot)
 */
router.post('/bot/user-session', [
  botAuthMiddleware,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('userPhone').notEmpty().withMessage('User phone is required'),
  body('timestamp').isISO8601().withMessage('Valid timestamp is required'),
  validateRequest
], botDataController.recordUserSession.bind(botDataController));

/**
 * @route POST /api/dashboard/bot/image-analysis
 * @desc Recevoir les données d'analyse d'image du bot
 * @access Private (Bot)
 */
router.post('/bot/image-analysis', [
  botAuthMiddleware,
  body('userId').notEmpty().withMessage('User ID is required'),
  body('userPhone').notEmpty().withMessage('User phone is required'),
  body('analysisType').isIn(['health', 'pest', 'alert']).withMessage('Invalid analysis type'),
  body('success').isBoolean().withMessage('Success must be boolean'),
  body('timestamp').isISO8601().withMessage('Valid timestamp is required'),
  validateRequest
], botDataController.recordImageAnalysis.bind(botDataController));

/**
 * @route POST /api/dashboard/bot/system-metric
 * @desc Recevoir une métrique système du bot
 * @access Private (Bot)
 */
router.post('/bot/system-metric', [
  botAuthMiddleware,
  body('service').notEmpty().withMessage('Service is required'),
  body('metric').notEmpty().withMessage('Metric is required'),
  body('value').isNumeric().withMessage('Value must be numeric'),
  body('timestamp').isISO8601().withMessage('Valid timestamp is required'),
  validateRequest
], botDataController.recordSystemMetric.bind(botDataController));

/**
 * @route POST /api/dashboard/bot/performance-metrics
 * @desc Recevoir les métriques de performance du bot
 * @access Private (Bot)
 */
router.post('/bot/performance-metrics', [
  botAuthMiddleware,
  body('metrics').isObject().withMessage('Metrics must be an object'),
  body('timestamp').isISO8601().withMessage('Valid timestamp is required'),
  validateRequest
], botDataController.recordPerformanceMetrics.bind(botDataController));

export default router;
