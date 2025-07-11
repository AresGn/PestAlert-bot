import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../middleware/auth';

const prisma = new PrismaClient();

export class AuthController {
  /**
   * POST /api/auth/login
   * Authentification des utilisateurs du dashboard
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Vérifier que l'utilisateur existe
      const user = await prisma.dashboardUser.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
          isActive: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Compte désactivé'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect'
        });
      }

      // Générer le token JWT
      const token = generateToken(user.id);

      // Mettre à jour la dernière connexion
      await prisma.dashboardUser.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      // Retourner les informations utilisateur (sans le mot de passe)
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Déconnexion (côté client principalement)
   */
  async logout(req: Request, res: Response) {
    // Pour un système JWT stateless, la déconnexion se fait côté client
    // En supprimant le token du localStorage/sessionStorage
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  }

  /**
   * GET /api/auth/me
   * Obtenir les informations de l'utilisateur connecté
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
      }

      const user = await prisma.dashboardUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { name, email } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
      }

      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      if (email) {
        const existingUser = await prisma.dashboardUser.findFirst({
          where: {
            email,
            id: { not: userId }
          }
        });

        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: 'Cet email est déjà utilisé'
          });
        }
      }

      // Mettre à jour l'utilisateur
      const updatedUser = await prisma.dashboardUser.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email })
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        }
      });

      res.json({
        success: true,
        data: updatedUser,
        message: 'Profil mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }

  /**
   * PUT /api/auth/password
   * Changer le mot de passe
   */
  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Non authentifié'
        });
      }

      // Récupérer l'utilisateur avec le mot de passe
      const user = await prisma.dashboardUser.findUnique({
        where: { id: userId },
        select: {
          id: true,
          password: true
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe actuel incorrect'
        });
      }

      // Hasher le nouveau mot de passe
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe
      await prisma.dashboardUser.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      res.json({
        success: true,
        message: 'Mot de passe changé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  }
}
