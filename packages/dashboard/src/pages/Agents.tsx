import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';
import AgentCard from '../components/AgentCard';
import AgentMap from '../components/AgentMap';
import { 
  Users, 
  MapPin, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search,
  Map,
  List
} from 'lucide-react';

// Types pour les agents
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
    averageResponseTime: number; // en minutes
    successRate: number; // en pourcentage
    rating: number; // sur 5
  };
  currentIntervention?: {
    id: string;
    alertId: string;
    farmerName: string;
    estimatedArrival: string;
  };
  createdAt: string;
}

// Données de test (en attendant l'API)
const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Mamadou Diallo',
    phone: '+221701234567',
    email: 'mamadou.diallo@pestalert.com',
    status: 'available',
    location: {
      lat: 14.6928,
      lon: -17.4467,
      address: 'Dakar, Sénégal'
    },
    zone: 'Dakar',
    specialties: ['Maladies des tomates', 'Ravageurs du mil'],
    stats: {
      totalInterventions: 45,
      averageResponseTime: 25,
      successRate: 92,
      rating: 4.8
    },
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Fatou Sall',
    phone: '+221702345678',
    email: 'fatou.sall@pestalert.com',
    status: 'busy',
    location: {
      lat: 14.7645,
      lon: -17.3660,
      address: 'Thiès, Sénégal'
    },
    zone: 'Thiès',
    specialties: ['Cultures maraîchères', 'Irrigation'],
    stats: {
      totalInterventions: 38,
      averageResponseTime: 30,
      successRate: 89,
      rating: 4.6
    },
    currentIntervention: {
      id: 'int_1',
      alertId: 'alert_1',
      farmerName: 'Amadou Ba',
      estimatedArrival: '2024-07-11T15:30:00Z'
    },
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Ousmane Ndiaye',
    phone: '+221703456789',
    status: 'offline',
    location: {
      lat: 16.0544,
      lon: -16.4527,
      address: 'Saint-Louis, Sénégal'
    },
    zone: 'Saint-Louis',
    specialties: ['Céréales', 'Légumineuses'],
    stats: {
      totalInterventions: 52,
      averageResponseTime: 22,
      successRate: 95,
      rating: 4.9
    },
    createdAt: '2023-12-10T00:00:00Z'
  }
];

function Agents() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    status: '',
    zone: '',
    search: ''
  });

  // Simulation d'une requête API
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents', filters],
    queryFn: async () => {
      // Simulation d'un délai API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrage des agents selon les critères
      let filteredAgents = mockAgents;
      
      if (filters.status) {
        filteredAgents = filteredAgents.filter(agent => agent.status === filters.status);
      }
      
      if (filters.zone) {
        filteredAgents = filteredAgents.filter(agent => 
          agent.zone.toLowerCase().includes(filters.zone.toLowerCase())
        );
      }
      
      if (filters.search) {
        filteredAgents = filteredAgents.filter(agent =>
          agent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          agent.phone.includes(filters.search)
        );
      }
      
      return filteredAgents;
    },
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Statistiques générales
  const stats = {
    total: agents?.length || 0,
    available: agents?.filter(a => a.status === 'available').length || 0,
    busy: agents?.filter(a => a.status === 'busy').length || 0,
    offline: agents?.filter(a => a.status === 'offline').length || 0,
    averageRating: agents?.length ? 
      (agents.reduce((sum, a) => sum + a.stats.rating, 0) / agents.length).toFixed(1) : '0'
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
          Erreur lors du chargement des agents
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agents de Terrain</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestion et suivi des agents d'intervention
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`p-2 rounded-md ${viewMode === 'map' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Map className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Agents</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Disponibles</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.available}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">En Mission</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.busy}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Hors Ligne</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.offline}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Note Moyenne</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.averageRating}/5</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
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
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="">Tous les statuts</option>
                <option value="available">Disponible</option>
                <option value="busy">En mission</option>
                <option value="offline">Hors ligne</option>
              </select>
            </div>
            
            <div>
              <select
                value={filters.zone}
                onChange={(e) => handleFilterChange('zone', e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="">Toutes les zones</option>
                <option value="Dakar">Dakar</option>
                <option value="Thiès">Thiès</option>
                <option value="Saint-Louis">Saint-Louis</option>
                <option value="Kaolack">Kaolack</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un agent..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents?.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-4">
          <AgentMap agents={agents || []} />
        </div>
      )}

      {agents?.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun agent trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun agent ne correspond aux critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
}

export default Agents;
