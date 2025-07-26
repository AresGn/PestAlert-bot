import { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../../_utils/cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: {
        totalFarmers: 156,
        totalAnalyses: 1247,
        successRate: 94.2,
        alertsCount: 7,
        activeSessions: 89,
        analysesToday: 23,
        systemHealth: 'healthy',
        uptime: '99.8%',
        timestamp: new Date().toISOString()
      }
    });
  } else {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}
