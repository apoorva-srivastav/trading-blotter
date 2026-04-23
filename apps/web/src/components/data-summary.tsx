'use client';

import React from 'react';
import { useOrderStore } from '@/stores/order-store';

export function DataSummary() {
  const { clientOrders, getOrderStats } = useOrderStore();
  const stats = getOrderStats();

  return (
    <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--trading-text))]">Data Summary</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[hsl(var(--trading-buy))]">
            {clientOrders.length}
          </div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))]">Client Orders</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">
            {stats.algoOrders}
          </div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))]">Algo Orders</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {stats.marketOrders}
          </div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))]">Market Orders</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">
            {stats.totalOrders}
          </div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))]">Total Orders</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[hsl(var(--trading-border))]">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[hsl(var(--trading-text-secondary))]">Total Value:</span>
            <span className="ml-2 font-mono font-bold">${stats.totalValue.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[hsl(var(--trading-text-secondary))]">Fill Rate:</span>
            <span className="ml-2 font-mono font-bold">{stats.fillRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      
      {clientOrders.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 font-medium">💡 No Data Loaded:</span>
            <span className="text-yellow-600 text-sm">Use the Sample Data Controls above to load test data</span>
          </div>
        </div>
      )}
    </div>
  );
}