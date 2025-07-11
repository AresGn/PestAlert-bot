import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users as UsersIcon, MapPin, Calendar, Activity } from 'lucide-react';

function Users() {
  const { data: userActivity, isLoading, error } = useQuery({
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
          Erreur lors du chargement des données utilisateurs
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de l'activité des agriculteurs
        </p>
      </div>

      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total utilisateurs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userActivity?.totalUsers.toLocaleString() || 0}
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
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Actifs aujourd'hui
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userActivity?.activeToday.toLocaleString() || 0}
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
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Nouveaux utilisateurs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userActivity?.newUsersToday.toLocaleString() || 0}
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
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Durée moyenne
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(userActivity?.averageSessionDuration || 0)} min
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition géographique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Répartition géographique
            </h3>
            <div className="space-y-4">
              {userActivity?.topLocations.map((location, index) => {
                const total = userActivity.topLocations.reduce((sum, loc) => sum + loc.count, 0);
                const percentage = total > 0 ? (location.count / total) * 100 : 0;
                
                return (
                  <div key={location.location}>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {location.location}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        {location.count.toLocaleString()} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
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
              Activité par période
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Aujourd'hui</span>
                <span className="text-sm text-gray-500">
                  {userActivity?.activeToday.toLocaleString() || 0} utilisateurs
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Cette semaine</span>
                <span className="text-sm text-gray-500">
                  {userActivity?.activeWeek.toLocaleString() || 0} utilisateurs
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Ce mois</span>
                <span className="text-sm text-gray-500">
                  {userActivity?.activeMonth.toLocaleString() || 0} utilisateurs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder pour la liste détaillée des utilisateurs */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Liste des utilisateurs
          </h3>
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Fonctionnalité en développement
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              La liste détaillée des utilisateurs sera disponible prochainement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
