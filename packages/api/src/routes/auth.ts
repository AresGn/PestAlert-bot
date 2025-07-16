import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { authenticateBot } from '../middleware/botAuth';
import { body } from 'express-validator';

const router = Router();
const authController = new AuthController();

/**
 * @route POST /api/auth/login
 * @desc Authentification des utilisateurs du dashboard
 * @access Public
 */
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Email valide requis')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  validateRequest
], authController.login.bind(authController));

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion
 * @access Private
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @route GET /api/auth/me
 * @desc Obtenir les informations de l'utilisateur connecté
 * @access Private
 */
router.get('/me', authMiddleware, authController.getProfile.bind(authController));

/**
 * @route PUT /api/auth/profile
 * @desc Mettre à jour le profil utilisateur
 * @access Private
 */
router.put('/profile', [
  authMiddleware,
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email valide requis')
    .normalizeEmail(),
  validateRequest
], authController.updateProfile.bind(authController));

/**
 * @route PUT /api/auth/password
 * @desc Changer le mot de passe
 * @access Private
 */
router.put('/password', [
  authMiddleware,
  body('currentPassword')
    .notEmpty()
    .withMessage('Mot de passe actuel requis'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  validateRequest
], authController.changePassword.bind(authController));

/**
 * @route POST /api/auth/bot-login
 * @desc Authentification des bots
 * @access Public
 */
router.post('/bot-login', [
  body('botId')
    .notEmpty()
    .withMessage('Bot ID requis'),
  body('secret')
    .notEmpty()
    .withMessage('Secret requis'),
  validateRequest
], (req: Request, res: Response) => {
  try {
    const { botId, secret } = req.body;

    const token = authenticateBot(botId, secret);

    if (token) {
      res.json({
        success: true,
        token,
        botId,
        message: 'Bot authentifié avec succès'
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Identifiants bot invalides'
      });
    }
  } catch (error) {
    console.error('Erreur authentification bot:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

export default router;
