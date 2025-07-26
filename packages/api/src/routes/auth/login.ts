import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { handleCors } from '../../../_utils/cors';

const DATABASE_URL = process.env.DATABASE_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
    return;
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    console.log('🔐 Tentative de connexion pour:', email);

    // Connexion à la base de données
    await client.connect();
    console.log('✅ Connexion DB réussie');

    // Rechercher l'utilisateur dans la base de données
    const userQuery = `
      SELECT id, email, name, role, password, is_active, last_login
      FROM dashboard_users
      WHERE email = $1 AND is_active = true
    `;

    const userResult = await client.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    const user = userResult.rows[0];
    console.log('👤 Utilisateur trouvé:', user.email);

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('❌ Mot de passe invalide pour:', email);
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    console.log('✅ Mot de passe valide');

    // Mettre à jour la dernière connexion
    const updateLoginQuery = `
      UPDATE dashboard_users
      SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;

    await client.query(updateLoginQuery, [user.id]);
    console.log('📝 Dernière connexion mise à jour');

    // Générer le token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'pestalert-super-secret-jwt-key-2024',
      { expiresIn: '24h' }
    );

    console.log('🎫 Token JWT généré');

    // Réponse de succès (format attendu par le dashboard)
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          lastLogin: user.last_login
        }
      }
    });

    console.log('🎉 Connexion réussie pour:', email);

  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  } finally {
    await client.end();
  }
}
