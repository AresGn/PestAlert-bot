import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      
      console.log('Login attempt:', { email, password });
      
      // Utilisateur admin par défaut pour le test
      if (email === 'admin@pestalert.com' && password === 'admin123') {
        const token = jwt.sign(
          { 
            id: 'admin-1',
            email: 'admin@pestalert.com',
            role: 'admin'
          },
          process.env.JWT_SECRET || 'default-secret-key-pestalert-2024',
          { expiresIn: '24h' }
        );
        
        res.status(200).json({
          success: true,
          token,
          user: {
            id: 'admin-1',
            email: 'admin@pestalert.com',
            name: 'Admin PestAlert',
            role: 'admin'
          }
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Identifiants invalides'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
