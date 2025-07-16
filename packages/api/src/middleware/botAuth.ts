import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface BotAuthRequest extends Request {
  bot?: {
    id: string;
    source: string;
  };
}

/**
 * Middleware d'authentification pour les bots
 */
export const botAuthMiddleware = (req: BotAuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification requis'
      });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Vérifier que c'est un token de bot
      if (decoded.type !== 'bot') {
        return res.status(401).json({
          success: false,
          error: 'Token invalide pour bot'
        });
      }

      req.bot = {
        id: decoded.botId,
        source: decoded.source || 'unknown'
      };

      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }
  } catch (error) {
    console.error('Erreur middleware bot auth:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

/**
 * Générer un token pour un bot
 */
export const generateBotToken = (botId: string, source: string = 'unknown'): string => {
  const jwtSecret = process.env.JWT_SECRET || 'default-secret';
  
  return jwt.sign(
    {
      botId,
      source,
      type: 'bot',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 an
    },
    jwtSecret
  );
};

/**
 * Vérifier les credentials du bot et générer un token
 */
export const authenticateBot = (botId: string, secret: string): string | null => {
  // Liste des bots autorisés (à déplacer vers une base de données en production)
  const authorizedBots = {
    'pestalert-railway-bot': process.env.BOT_API_SECRET || 'default-bot-secret',
    'pestalert-local-bot': process.env.BOT_API_SECRET || 'default-bot-secret'
  };

  if (authorizedBots[botId as keyof typeof authorizedBots] === secret) {
    return generateBotToken(botId, 'railway');
  }

  return null;
};
