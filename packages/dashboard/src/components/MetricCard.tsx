import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'emerald';
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
}

const colorClasses = {
  blue: {
    icon: 'text-blue-600',
    bg: 'bg-blue-100',
    text: 'text-blue-600'
  },
  green: {
    icon: 'text-green-600',
    bg: 'bg-green-100',
    text: 'text-green-600'
  },
  red: {
    icon: 'text-red-600',
    bg: 'bg-red-100',
    text: 'text-red-600'
  },
  yellow: {
    icon: 'text-yellow-600',
    bg: 'bg-yellow-100',
    text: 'text-yellow-600'
  },
  purple: {
    icon: 'text-purple-600',
    bg: 'bg-purple-100',
    text: 'text-purple-600'
  },
  emerald: {
    icon: 'text-emerald-600',
    bg: 'bg-emerald-100',
    text: 'text-emerald-600'
  }
};

function MetricCard({ title, value, icon: Icon, color, subtitle, trend }: MetricCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`p-3 rounded-md ${colors.bg}`}>
              <Icon className={`h-6 w-6 ${colors.icon}`} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {subtitle && (
                  <div className="ml-2 text-sm text-gray-500">
                    {subtitle}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`font-medium ${colors.text}`}>
              {trend.value.toLocaleString()}
            </span>
            <span className="text-gray-500 ml-1">
              {trend.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricCard;
