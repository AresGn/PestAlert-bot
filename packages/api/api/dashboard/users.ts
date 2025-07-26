import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

// Interfaces pour le typage des données
interface UserStats {
  total_users: string;
  active_users: string;
  new_users_30_days: string;
  active_last_7_days: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

interface ActivityRow {
  date: string;
  logins: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
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
    await client.connect();
    
    // Récupérer les statistiques des utilisateurs
    const usersStatsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30_days,
        COUNT(CASE WHEN last_login >= NOW() - INTERVAL '7 days' THEN 1 END) as active_last_7_days
      FROM dashboard_users
    `;
    
    const statsResult = await client.query(usersStatsQuery);
    const stats: UserStats = statsResult.rows[0];
    
    // Récupérer la liste des utilisateurs récents
    const recentUsersQuery = `
      SELECT id, name, email, role, created_at, last_login, is_active
      FROM dashboard_users 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    
    const usersResult = await client.query(recentUsersQuery);
    
    // Activité utilisateur par jour (derniers 7 jours)
    const activityQuery = `
      SELECT 
        DATE(last_login) as date,
        COUNT(*) as logins
      FROM dashboard_users 
      WHERE last_login >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(last_login)
      ORDER BY date DESC
    `;
    
    const activityResult = await client.query(activityQuery);
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers: parseInt(stats.total_users),
          activeUsers: parseInt(stats.active_users),
          newUsers: parseInt(stats.new_users_30_days),
          activeLastWeek: parseInt(stats.active_last_7_days)
        },
        recentUsers: usersResult.rows.map((user: UserRow) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          lastLogin: user.last_login,
          isActive: user.is_active
        })),
        activity: activityResult.rows.map((row: ActivityRow) => ({
          date: row.date,
          logins: parseInt(row.logins)
        }))
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur users endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  } finally {
    await client.end();
  }
}
