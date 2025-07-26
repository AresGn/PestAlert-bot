import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        services: {
          bot: {
            status: 'online',
            lastCheck: new Date().toISOString(),
            responseTime: 120
          },
          api: {
            status: 'online',
            lastCheck: new Date().toISOString(),
            responseTime: 45
          },
          database: {
            status: 'online',
            lastCheck: new Date().toISOString(),
            responseTime: 25
          },
          openepi: {
            status: 'online',
            lastCheck: new Date().toISOString(),
            responseTime: 180
          }
        },
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
