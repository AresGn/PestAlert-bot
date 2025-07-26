import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { handleCors } from '../../../_utils/cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'Token manquant'
        });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key-pestalert-2024') as any;
      
      res.status(200).json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: 'Admin PestAlert',
          role: decoded.role
        }
      });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        error: 'Token invalide'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
