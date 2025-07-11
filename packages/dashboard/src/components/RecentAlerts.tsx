import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from './LoadingSpinner';
import { AlertTriangle, MapPin, Clock, ArrowRight } from 'lucide-react';

function RecentAlerts() {
  const { data: alertsData, isLoading, error } = useQuery({
    queryKey: ['recent-alerts'],
    queryFn: () => dashboardService.getAlerts({ limit: 5 }),
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });

  if (isLoading) {
    return (
      <div className="h-32 flex items-center justify-center">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error || !alertsData) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          Impossible de charger les alertes récentes
        </p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  if (alertsData.alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune alerte récente</h3>
        <p className="mt-1 text-sm text-gray-500">
          Toutes les alertes ont été traitées.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alertsData.alerts.map((alert) => (
        <div
          key={alert.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                  {alert.status === 'active' ? 'Active' : alert.status === 'resolved' ? 'Résolue' : 'En attente'}
                </span>
              </div>
              
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {alert.message}
              </h4>
              
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <span className="font-medium">{alert.farmerName}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{alert.location.city}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatTimeAgo(alert.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex-shrink-0">
              <Link
                to={`/alerts?id=${alert.id}`}
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                Voir détails
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {alertsData.alerts.length > 0 && (
        <div className="text-center pt-4">
          <Link
            to="/alerts"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Voir toutes les alertes
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecentAlerts;
