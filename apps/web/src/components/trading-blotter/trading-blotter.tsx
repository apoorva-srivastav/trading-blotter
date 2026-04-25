'use client';

import React from 'react';
import { OrderTable } from './order-table';
import { MarketOrdersPanel } from './market-orders-panel';
import { FilterBar } from './filter-bar';
import { StatsBar } from './stats-bar';
import { useOrderStore } from '@/stores/order-store';
import { MockWebSocketProvider } from '../mock-websocket-provider';
import { SampleDataLoader } from '../sample-data-loader';
import { DataSummary } from '../data-summary';

function TradingBlotterContent() {
  const { error, isLoading } = useOrderStore();

  return (
    <div className="min-h-screen bg-[hsl(var(--trading-bg))] text-[hsl(var(--trading-text))] font-mono">
      {/* Header */}
      <header className="bg-[hsl(var(--trading-surface))] border-b border-[hsl(var(--trading-border))] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trading Blotter</h1>
            <p className="text-sm text-[hsl(var(--trading-text-secondary))] mt-1">
              High-performance hierarchical order management system
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--trading-bg))] rounded">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--trading-buy))] animate-pulse" />
              <span className="text-xs text-[hsl(var(--trading-text-secondary))]">
                Mock Data
              </span>
            </div>
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs text-yellow-500">Loading...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Error Banner */}
        {error && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-medium">⚠ Error:</span>
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          </div>
        )}
      </header>

      {/* Sample Data Controls */}
      <div className="px-6 py-4 border-b border-[hsl(var(--trading-border))]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SampleDataLoader />
          <DataSummary />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Stats Bar */}
        <StatsBar />
        
        {/* Filter Bar */}
        <FilterBar />
        
        {/* Main Trading Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Client & Algo Orders Table */}
          <OrderTable />
          
          {/* Market Orders Panel */}
          <MarketOrdersPanel />
        </div>
      </main>
    </div>
  );
}

export function TradingBlotter() {
  return (
    <MockWebSocketProvider>
      <TradingBlotterContent />
    </MockWebSocketProvider>
  );
}