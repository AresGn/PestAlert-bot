import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';

function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics', selectedPeriod],
    queryFn: () => dashboardService.getAnalytics(selectedPeriod),
    refetchInterval: 60000, // Actualiser toutes les minutes
  });

  const { data: userActivity } = useQuery({
    queryKey: ['user-activity'],
    queryFn: () => dashboardService.getUserActivity(),
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">
          Erreur lors du chargement des analytics
        </div>
      </div>
    );
  }

  const periods = [
    { value: 7, label: '7 jours' },
    { value: 30, label: '30 jours' },
    { value: 90, label: '90 jours' }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyse détaillée de l'utilisation et des performances
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total analyses
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.total.toLocaleString() || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taux de succès
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics ? Math.round((analytics.successful / analytics.total) * 100) : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Analyses santé
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.byType.health.toLocaleString() || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Détection ravageurs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics?.byType.pest.toLocaleString() || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition par type d'analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Répartition par type d'analyse
            </h3>
            <div className="space-y-4">
              {analytics && Object.entries(analytics.byType).map(([type, count]) => {
                const percentage = analytics.total > 0 ? (count / analytics.total) * 100 : 0;
                const typeLabels = {
                  health: 'Santé des cultures',
                  pest: 'Détection de ravageurs',
                  alert: 'Alertes'
                };
                const colors = {
                  health: 'bg-green-500',
                  pest: 'bg-orange-500',
                  alert: 'bg-red-500'
                };
                
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">
                        {typeLabels[type as keyof typeof typeLabels]}
                      </span>
                      <span className="text-gray-500">
                        {count.toLocaleString()} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[type as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Niveau de confiance
            </h3>
            <div className="space-y-4">
              {analytics && Object.entries(analytics.byConfidenceLevel).map(([level, count]) => {
                const percentage = analytics.total > 0 ? (count / analytics.total) * 100 : 0;
                const levelLabels = {
                  high: 'Confiance élevée (70-100%)',
                  medium: 'Confiance moyenne (30-70%)',
                  low: 'Confiance faible (0-30%)'
                };
                const colors = {
                  high: 'bg-green-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-red-500'
                };
                
                return (
                  <div key={level}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">
                        {levelLabels[level as keyof typeof levelLabels]}
                      </span>
                      <span className="text-gray-500">
                        {count.toLocaleString()} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[level as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Activité des utilisateurs */}
      {userActivity && (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Activité des utilisateurs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userActivity.totalUsers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total utilisateurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userActivity.activeToday.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Actifs aujourd'hui</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(userActivity.averageSessionDuration)} min
                </div>
                <div className="text-sm text-gray-500">Durée moyenne</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
