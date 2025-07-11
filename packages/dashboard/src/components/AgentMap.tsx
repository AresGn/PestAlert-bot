import React from 'react';
import { MapPin, Users, Activity, AlertCircle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lon: number;
    address: string;
  };
  zone: string;
}

interface AgentMapProps {
  agents: Agent[];
}

function AgentMap({ agents }: AgentMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'busy':
        return 'text-orange-600 bg-orange-100';
      case 'offline':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Users className="h-4 w-4" />;
      case 'busy':
        return <Activity className="h-4 w-4" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Grouper les agents par zone pour l'affichage
  const agentsByZone = agents.reduce((acc, agent) => {
    if (!acc[agent.zone]) {
      acc[agent.zone] = [];
    }
    acc[agent.zone].push(agent);
    return acc;
  }, {} as Record<string, Agent[]>);

  return (
    <div className="h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center max-w-md">
        <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Carte Interactive (En Développement)
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          La carte interactive avec React Leaflet sera intégrée prochainement pour visualiser 
          la position des agents en temps réel.
        </p>
        
        {/* Aperçu des zones en attendant */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Répartition par Zone
          </h4>
          <div className="space-y-2">
            {Object.entries(agentsByZone).map(([zone, zoneAgents]) => (
              <div key={zone} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{zone}</span>
                <div className="flex items-center space-x-2">
                  {zoneAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-1 rounded-full ${getStatusColor(agent.status)}`}
                      title={`${agent.name} - ${agent.status}`}
                    >
                      {getStatusIcon(agent.status)}
                    </div>
                  ))}
                  <span className="text-gray-500">({zoneAgents.length})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          🗺️ Fonctionnalités à venir : Géolocalisation en temps réel, trajets optimisés, zones de couverture
        </div>
      </div>
    </div>
  );
}

export default AgentMap;
