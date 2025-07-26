import { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../_utils/cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      message: 'PestAlert API is running'
    });
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
