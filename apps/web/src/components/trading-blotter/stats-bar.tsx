'use client';

import React, { useMemo } from 'react';
import { useOrderStore } from '@/stores/order-store';

// Atomic component for stat card
const StatCard = React.memo<{
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'success' | 'warning' | 'danger';
}>(({ label, value, subValue, trend, color = 'default' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'danger':
        return 'text-red-500';
      default:
        return 'text-[hsl(var(--trading-text))]';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↗</span>;
      case 'down':
        return <span className="text-red-500">↘</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[hsl(var(--trading-text-secondary))] font-medium">
          {label}
        </div>
        {getTrendIcon()}
      </div>
      <div className={`text-2xl font-bold mt-1 ${getColorClasses()}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {subValue && (
        <div className="text-xs text-[hsl(var(--trading-text-secondary))] mt-1">
          {subValue}
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';

// Main StatsBar organism component
export function StatsBar() {
  const { getOrderStats, getFilteredClientOrders } = useOrderStore();
  
  const stats = useMemo(() => getOrderStats(), [getOrderStats]);
  const filteredOrders = useMemo(() => getFilteredClientOrders(), [getFilteredClientOrders]);
  
  const fillRateColor = useMemo(() => {
    if (stats.fillRate >= 90) return 'success';
    if (stats.fillRate >= 70) return 'warning';
    return 'danger';
  }, [stats.fillRate]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Order Statistics</h2>
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--trading-text-secondary))]">
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--trading-buy))] animate-pulse"></div>
          <span>Real-time</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          subValue={`${filteredOrders.length} visible`}
        />
        
        <StatCard
          label="Client Orders"
          value={stats.clientOrders}
          subValue="Top level"
          color="default"
        />
        
        <StatCard
          label="Algo Orders"
          value={stats.algoOrders}
          subValue="Algorithms"
          color="default"
        />
        
        <StatCard
          label="Market Orders"
          value={stats.marketOrders}
          subValue="Executions"
          color="default"
        />
        
        <StatCard
          label="Fill Rate"
          value={`${stats.fillRate.toFixed(1)}%`}
          subValue="Completion"
          color={fillRateColor}
        />
        
        <StatCard
          label="Total Value"
          value={formatCurrency(stats.totalValue)}
          subValue={`Done: ${formatCurrency(stats.totalDoneValue)}`}
          color="default"
        />
      </div>
      
      {/* Additional metrics row */}
      <div className="mt-4 pt-4 border-t border-[hsl(var(--trading-border))]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--trading-text-secondary))]">Average Order Size:</span>
            <span className="font-mono font-semibold">{formatCurrency(stats.avgOrderSize)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--trading-text-secondary))]">Pending Value:</span>
            <span className="font-mono font-semibold text-yellow-500">
              {formatCurrency(stats.totalValue - stats.totalDoneValue)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-[hsl(var(--trading-text-secondary))]">Execution Rate:</span>
            <span className="font-mono font-semibold">
              {stats.marketOrders > 0 ? (stats.marketOrders / stats.algoOrders).toFixed(1) : '0.0'} orders/algo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}