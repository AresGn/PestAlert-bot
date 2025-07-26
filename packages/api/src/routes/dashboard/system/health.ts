import { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCors } from '../../../../_utils/cors';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

interface SystemHealth {
  overall: string;
  services: {
    [key: string]: {
      status: string;
      responseTime?: number;
      uptime?: string;
    };
  };
  lastCheck: string;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
    return;
  }

  try {
    // Sample system health data
    const systemHealth: SystemHealth = {
      overall: 'healthy',
      services: {
        api: {
          status: 'online',
          responseTime: 95,
          uptime: '99.9%'
        },
        database: {
          status: 'online',
          responseTime: 45,
          uptime: '99.8%'
        },
        bot: {
          status: 'online',
          responseTime: 120,
          uptime: '99.7%'
        },
        openepi: {
          status: 'online',
          responseTime: 250,
          uptime: '98.5%'
        },
        monitoring: {
          status: 'online',
          responseTime: 80,
          uptime: '99.9%'
        }
      },
      lastCheck: new Date().toISOString()
    };

    const response: ApiResponse<SystemHealth> = {
      success: true,
      data: systemHealth,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error in system health endpoint:', error);
    
    const errorResponse: ApiResponse<SystemHealth> = {
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    };

    res.status(500).json(errorResponse);
  }
}
