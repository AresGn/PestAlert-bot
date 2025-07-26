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
        newUsersToday: 12,
        activeUsersToday: 156,
        totalSessions: 89,
        averageSessionDuration: 25.5,
        peakHours: [
          { hour: 8, users: 45 },
          { hour: 9, users: 67 },
          { hour: 10, users: 89 },
          { hour: 11, users: 78 },
          { hour: 14, users: 92 },
          { hour: 15, users: 85 },
          { hour: 16, users: 73 }
        ],
        userGrowth: [
          { date: '2025-01-20', users: 142 },
          { date: '2025-01-21', users: 148 },
          { date: '2025-01-22', users: 151 },
          { date: '2025-01-23', users: 153 },
          { date: '2025-01-24', users: 155 },
          { date: '2025-01-25', users: 156 },
          { date: '2025-01-26', users: 156 }
        ],
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
