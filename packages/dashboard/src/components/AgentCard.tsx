import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Clock, 
  CheckCircle, 
  Activity,
  AlertCircle,
  Navigation,
  Award
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lon: number;
    address: string;
  };
  zone: string;
  specialties: string[];
  stats: {
    totalInterventions: number;
    averageResponseTime: number;
    successRate: number;
    rating: number;
  };
  currentIntervention?: {
    id: string;
    alertId: string;
    farmerName: string;
    estimatedArrival: string;
  };
  createdAt: string;
}

interface AgentCardProps {
  agent: Agent;
}

function AgentCard({ agent }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'busy':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'busy':
        return <Activity className="h-4 w-4" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'En mission';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Inconnu';
    }
  };

  const formatETA = (dateString: string) => {
    const eta = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.round((eta.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= 0) return 'Arrivé';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* En-tête avec nom et statut */}
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {agent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500">{agent.zone}</p>
            </div>
          </div>
          
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
            <span className="ml-1">{getStatusText(agent.status)}</span>
          </span>
        </div>

        {/* Mission en cours */}
        {agent.currentIntervention && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center">
              <Navigation className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-800">Mission en cours</span>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Chez {agent.currentIntervention.farmerName}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              Arrivée estimée: {formatETA(agent.currentIntervention.estimatedArrival)}
            </p>
          </div>
        )}

        {/* Informations de contact */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="h-4 w-4 mr-2" />
            <span>{agent.phone}</span>
          </div>
          {agent.email && (
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              <span>{agent.email}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{agent.location.address}</span>
          </div>
        </div>

        {/* Spécialités */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Spécialités</p>
          <div className="flex flex-wrap gap-1">
            {agent.specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Award className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-lg font-semibold text-gray-900">
                  {agent.stats.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Note moyenne</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-lg font-semibold text-gray-900">
                  {agent.stats.successRate}%
                </span>
              </div>
              <p className="text-xs text-gray-500">Taux de succès</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Activity className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-lg font-semibold text-gray-900">
                  {agent.stats.totalInterventions}
                </span>
              </div>
              <p className="text-xs text-gray-500">Interventions</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Clock className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-lg font-semibold text-gray-900">
                  {agent.stats.averageResponseTime}min
                </span>
              </div>
              <p className="text-xs text-gray-500">Temps moyen</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Voir Détails
          </button>
          {agent.status === 'available' && (
            <button className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Assigner Mission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentCard;
