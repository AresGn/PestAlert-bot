import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from './LoadingSpinner';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PerformanceChart() {
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['performance-chart', 24],
    queryFn: () => dashboardService.getPerformanceChartData(24),
    refetchInterval: 2 * 60 * 1000, // Actualiser toutes les 2 minutes
  });

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Impossible de charger les données de performance
          </p>
        </div>
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                // Temps de réponse en ms
                label += Math.round(context.parsed.y) + ' ms';
              } else {
                // Disponibilité en %
                label += Math.round(context.parsed.y * 100) / 100 + '%';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          maxTicksLimit: 8
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value: any) {
            return Math.round(value) + ' ms';
          }
        },
        title: {
          display: true,
          text: 'Temps de réponse (ms)',
          font: {
            size: 12
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 85,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value: any) {
            return Math.round(value) + '%';
          }
        },
        title: {
          display: true,
          text: 'Disponibilité (%)',
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5
      },
      line: {
        tension: 0.2
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default PerformanceChart;
