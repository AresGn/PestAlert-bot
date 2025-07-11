import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { body, query } from 'express-validator';

const router = Router();
const dashboardController = new DashboardController();

// Middleware d'authentification pour toutes les routes du dashboard
router.use(authMiddleware);

/**
 * @route GET /api/dashboard/metrics
 * @desc Obtenir les métriques principales du dashboard
 * @access Private (Admin)
 */
router.get('/metrics', dashboardController.getMetrics.bind(dashboardController));

/**
 * @route GET /api/dashboard/analytics
 * @desc Obtenir les statistiques d'analyses
 * @access Private (Admin)
 */
router.get('/analytics', [
  query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365'),
  validateRequest
], dashboardController.getAnalytics.bind(dashboardController));

/**
 * @route GET /api/dashboard/users
 * @desc Obtenir les statistiques d'activité des utilisateurs
 * @access Private (Admin)
 */
router.get('/users', dashboardController.getUserActivity.bind(dashboardController));

/**
 * @route GET /api/dashboard/charts/usage
 * @desc Obtenir les données pour les graphiques d'utilisation
 * @access Private (Admin)
 */
router.get('/charts/usage', [
  query('days').optional().isInt({ min: 1, max: 90 }).withMessage('Days must be between 1 and 90'),
  validateRequest
], dashboardController.getUsageChartData.bind(dashboardController));

/**
 * @route GET /api/dashboard/charts/performance
 * @desc Obtenir les données pour les graphiques de performance
 * @access Private (Admin)
 */
router.get('/charts/performance', [
  query('hours').optional().isInt({ min: 1, max: 168 }).withMessage('Hours must be between 1 and 168'),
  validateRequest
], dashboardController.getPerformanceChartData.bind(dashboardController));

/**
 * @route GET /api/dashboard/alerts
 * @desc Obtenir la liste des alertes avec pagination
 * @access Private (Admin)
 */
router.get('/alerts', [
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
  body('resolution').notEmpty().withMessage('Resolution is required'),
  body('agentId').optional().isString().withMessage('Agent ID must be a string'),
  validateRequest
], dashboardController.resolveAlert.bind(dashboardController));

/**
 * @route GET /api/dashboard/system/health
 * @desc Vérifier la santé du système
 * @access Private (Admin)
 */
router.get('/system/health', dashboardController.getSystemHealth.bind(dashboardController));

export default router;
