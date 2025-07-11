import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import MetricCard from '../components/MetricCard';
import SystemStatus from '../components/SystemStatus';
import UsageChart from '../components/UsageChart';
import PerformanceChart from '../components/PerformanceChart';
import RecentAlerts from '../components/RecentAlerts';
import {
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

function Dashboard() {
  // Requêtes pour récupérer les données
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => dashboardService.getMetrics(),
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });

  const { data: userActivity, isLoading: userActivityLoading } = useQuery({
    queryKey: ['user-activity'],
    queryFn: () => dashboardService.getUserActivity(),
    refetchInterval: 60000, // Actualiser toutes les minutes
  });

  const { data: systemHealth, isLoading: systemHealthLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: () => dashboardService.getSystemHealth(),
    refetchInterval: 30000,
  });

  if (metricsLoading || userActivityLoading || systemHealthLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (metricsError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">
          Erreur lors du chargement des données du dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de l'activité PestAlert
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Utilisateurs actifs"
          value={metrics?.activeUsers || 0}
          icon={Users}
          color="blue"
          subtitle="Aujourd'hui"
          trend={userActivity ? {
            value: userActivity.newUsersToday,
            label: "nouveaux utilisateurs"
          } : undefined}
        />
        
        <MetricCard
          title="Analyses effectuées"
          value={metrics?.totalAnalysesToday || 0}
          icon={BarChart3}
          color="green"
          subtitle="Aujourd'hui"
          trend={{
            value: metrics?.totalAnalysesWeek || 0,
            label: "cette semaine"
          }}
        />
        
        <MetricCard
          title="Alertes actives"
          value={metrics?.activeAlerts || 0}
          icon={AlertTriangle}
          color="red"
          subtitle="En cours"
          trend={{
            value: metrics?.resolvedAlertsToday || 0,
            label: "résolues aujourd'hui"
          }}
        />
        
        <MetricCard
          title="Taux de succès"
          value={`${Math.round(metrics?.successRate || 0)}%`}
          icon={CheckCircle}
          color="emerald"
          subtitle="Analyses réussies"
          trend={{
            value: Math.round(metrics?.averageResponseTime || 0),
            label: "ms temps moyen"
          }}
        />
      </div>

      {/* Statut du système */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemStatus 
            systemStatus={metrics?.systemStatus}
            systemHealth={systemHealth}
          />
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Activité récente
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userActivity?.activeToday || 0} utilisateurs actifs
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Cette semaine:</span>
                <span className="font-medium">{userActivity?.activeWeek || 0}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">Ce mois:</span>
                <span className="font-medium">{userActivity?.activeMonth || 0}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">Durée moyenne:</span>
                <span className="font-medium">
                  {Math.round(userActivity?.averageSessionDuration || 0)} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Utilisation (7 derniers jours)
            </h3>
            <div className="mt-4">
              <UsageChart />
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Performance (24 dernières heures)
            </h3>
            <div className="mt-4">
              <PerformanceChart />
            </div>
          </div>
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Alertes récentes
          </h3>
          <div className="mt-4">
            <RecentAlerts />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
