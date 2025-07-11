import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertTriangle, MapPin, Clock, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

function Alerts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    search: ''
  });

  const { data: alertsData, isLoading, error } = useQuery({
    queryKey: ['alerts', currentPage, filters],
    queryFn: () => dashboardService.getAlerts({
      page: currentPage,
      limit: 10,
      status: filters.status || undefined,
      severity: filters.severity || undefined
    }),
    refetchInterval: 30000,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

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
          Erreur lors du chargement des alertes
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des alertes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Suivi et gestion des alertes des agriculteurs
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filtres:</span>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="sr-only">Statut</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Active</option>
                <option value="resolved">Résolue</option>
                <option value="pending">En attente</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="severity" className="sr-only">Sévérité</label>
              <select
                id="severity"
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="">Toutes les sévérités</option>
                <option value="CRITICAL">Critique</option>
                <option value="HIGH">Élevée</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Faible</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des alertes */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {alertsData && alertsData.alerts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {alertsData.alerts.map((alert) => (
              <li key={alert.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <AlertTriangle className={`h-6 w-6 ${
                          alert.severity === 'CRITICAL' ? 'text-red-500' :
                          alert.severity === 'HIGH' ? 'text-orange-500' :
                          alert.severity === 'MEDIUM' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                            {alert.status === 'active' ? 'Active' : 
                             alert.status === 'resolved' ? 'Résolue' : 'En attente'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {alert.message}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                          <span className="font-medium">{alert.farmerName}</span>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{alert.location.city}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDate(alert.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.status === 'active' && (
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          Résoudre
                        </button>
                      )}
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune alerte</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune alerte ne correspond aux critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {alertsData && alertsData.pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(alertsData.pagination.totalPages, currentPage + 1))}
              disabled={currentPage === alertsData.pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de{' '}
                <span className="font-medium">
                  {(currentPage - 1) * alertsData.pagination.limit + 1}
                </span>{' '}
                à{' '}
                <span className="font-medium">
                  {Math.min(currentPage * alertsData.pagination.limit, alertsData.pagination.total)}
                </span>{' '}
                sur{' '}
                <span className="font-medium">{alertsData.pagination.total}</span>{' '}
                résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {currentPage} / {alertsData.pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(alertsData.pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === alertsData.pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;
