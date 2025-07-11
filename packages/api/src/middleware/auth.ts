import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

/**
 * Middleware d'authentification JWT
 */
export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification requis'
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET non configuré');
      return res.status(500).json({
        success: false,
        error: 'Configuration serveur manquante'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.dashboardUser.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé ou inactif'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    
    // Mettre à jour la dernière connexion
    await prisma.dashboardUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expiré'
      });
    }

    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
}

/**
 * Middleware pour vérifier les rôles
 */
export function requireRole(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes'
      });
    }

    next();
  };
}

/**
 * Middleware pour les administrateurs uniquement
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Middleware pour les opérateurs et administrateurs
 */
export const requireOperator = requireRole(['admin', 'operator']);

/**
 * Extraire le token de la requête
 */
function extractToken(req: Request): string | null {
  // Vérifier l'en-tête Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Vérifier les cookies (optionnel)
  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Générer un token JWT
 */
export function generateToken(userId: string, expiresIn: string = '24h'): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET non configuré');
  }

  return jwt.sign(
    { userId } as object,
    jwtSecret as string,
    { expiresIn } as jwt.SignOptions
  );
}

/**
 * Vérifier un token sans middleware
 */
export function verifyToken(token: string): any {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET non configuré');
  }

  return jwt.verify(token, jwtSecret);
}
