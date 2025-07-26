import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://pestalert-api.vercel.app';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

interface DashboardMetrics {
  activeUsers: number;
  totalAnalysesToday: number;
  totalAnalysesWeek: number;
  totalAnalysesMonth: number;
  activeAlerts: number;
  resolvedAlertsToday: number;
  systemStatus: {
    bot: 'online' | 'offline' | 'error';
    api: 'online' | 'offline' | 'error';
    database: 'online' | 'offline' | 'error';
    openepi: 'online' | 'offline' | 'error';
  };
  averageResponseTime: number;
  successRate: number;
}

interface AnalysisStats {
  total: number;
  successful: number;
  failed: number;
  byType: {
    health: number;
    pest: number;
    alert: number;
  };
  byConfidenceLevel: {
    high: number;
    medium: number;
    low: number;
  };
}

interface UserActivity {
  totalUsers: number;
  activeToday: number;
  activeWeek: number;
  activeMonth: number;
  newUsersToday: number;
  averageSessionDuration: number;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    yAxisID?: string;
  }>;
}

interface Alert {
  id: string;
  farmerId: string;
  farmerName: string;
  type: string;
  severity: string;
  message: string;
  status: string;
  createdAt: string;
  location: {
    lat: number;
    lon: number;
    city: string;
  };
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

class DashboardService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api/dashboard`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token aux requêtes
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtenir les métriques principales
   */
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await this.api.get<ApiResponse<DashboardMetrics>>('/metrics');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la récupération des métriques');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des métriques:', error);
      throw new Error('Impossible de récupérer les métriques');
    }
  }

  /**
   * Obtenir les statistiques d'analyses
   */
  async getAnalytics(days: number = 30): Promise<AnalysisStats> {
    try {
      const response = await this.api.get<ApiResponse<AnalysisStats>>('/analytics', {
        params: { days }
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la récupération des analytics');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des analytics:', error);
      throw new Error('Impossible de récupérer les analytics');
    }
  }

  /**
   * Obtenir l'activité des utilisateurs
   */
  async getUserActivity(): Promise<UserActivity> {
    try {
      const response = await this.api.get<ApiResponse<UserActivity>>('/users');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la récupération de l\'activité utilisateur');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'activité utilisateur:', error);
      throw new Error('Impossible de récupérer l\'activité utilisateur');
    }
  }

  /**
   * Obtenir les données de graphique d'utilisation
   */
  async getUsageChartData(days: number = 7): Promise<ChartData> {
    try {
      const response = await this.api.get<ApiResponse<ChartData>>('/charts/usage', {
        params: { days }
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la récupération des données de graphique');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données de graphique:', error);
      throw new Error('Impossible de récupérer les données de graphique');
    }
  }

  /**
   * Obtenir les données de graphique de performance
   */
  async getPerformanceChartData(hours: number = 24): Promise<ChartData> {
    try {
      const response = await this.api.get<ApiResponse<ChartData>>('/charts/performance', {
        params: { hours }
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la récupération des données de performance');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données de performance:', error);
      throw new Error('Impossible de récupérer les données de performance');
    }
  }

  /**
   * Obtenir les alertes
   */
  async getAlerts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
  }): Promise<{
    alerts: Alert[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await this.api.get('/alerts', { params });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la récupération des alertes');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw new Error('Impossible de récupérer les alertes');
    }
  }

  /**
   * Résoudre une alerte
   */
  async resolveAlert(alertId: string, resolution: string, agentId?: string): Promise<void> {
    try {
      const response = await this.api.post(`/alerts/${alertId}/resolve`, {
        resolution,
        agentId
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erreur lors de la résolution de l\'alerte');
      }
    } catch (error: any) {
      console.error('Erreur lors de la résolution de l\'alerte:', error);
      throw new Error('Impossible de résoudre l\'alerte');
    }
  }

  /**
   * Obtenir la santé du système
   */
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const response = await this.api.get<ApiResponse<SystemHealth>>('/system/health');
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Erreur lors de la vérification de la santé du système');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Erreur lors de la vérification de la santé du système:', error);
      throw new Error('Impossible de vérifier la santé du système');
    }
  }
}

export const dashboardService = new DashboardService();
export type { DashboardMetrics, AnalysisStats, UserActivity, ChartData, Alert, SystemHealth };
