import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { SystemHealth } from '../services/dashboardService';

interface SystemStatusProps {
  systemStatus?: {
    bot: 'online' | 'offline' | 'error';
    api: 'online' | 'offline' | 'error';
    database: 'online' | 'offline' | 'error';
    openepi: 'online' | 'offline' | 'error';
  };
  systemHealth?: SystemHealth;
}

function SystemStatus({ systemStatus, systemHealth }: SystemStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'Opérationnel';
      case 'offline':
        return 'Hors ligne';
      case 'error':
        return 'Erreur';
      case 'warning':
        return 'Attention';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
        return 'text-green-700';
      case 'offline':
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      default:
        return 'text-gray-700';
    }
  };

  const services = [
    {
      name: 'Bot WhatsApp',
      key: 'bot',
      description: 'Service de messagerie WhatsApp'
    },
    {
      name: 'API Backend',
      key: 'api',
      description: 'Interface de programmation'
    },
    {
      name: 'Base de données',
      key: 'database',
      description: 'Stockage des données'
    },
    {
      name: 'OpenEPI',
      key: 'openepi',
      description: 'Service d\'analyse d\'images'
    }
  ];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Statut du système
        </h3>
        
        <div className="space-y-4">
          {services.map((service) => {
            const status = systemStatus?.[service.key as keyof typeof systemStatus] || 'offline';
            const healthInfo = systemHealth?.services?.[service.key];
            
            return (
              <div key={service.key} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {service.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {service.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-sm font-medium ${getStatusColor(status)}`}>
                    {getStatusText(status)}
                  </p>
                  {healthInfo?.responseTime && (
                    <p className="text-xs text-gray-500">
                      {healthInfo.responseTime}ms
                    </p>
                  )}
                  {healthInfo?.uptime && (
                    <p className="text-xs text-gray-500">
                      {healthInfo.uptime}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {systemHealth?.lastCheck && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Dernière vérification: {new Date(systemHealth.lastCheck).toLocaleString('fr-FR')}
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {systemHealth?.overall === 'healthy' ? (
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-900">
              État général: {systemHealth?.overall === 'healthy' ? 'Sain' : 'Attention requise'}
            </span>
          </div>
          
          <button className="text-sm text-blue-600 hover:text-blue-500">
            Actualiser
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemStatus;
