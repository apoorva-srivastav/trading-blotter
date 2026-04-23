'use client';

import React from 'react';
import { OrderTable } from './order-table';
import { MarketOrdersTable } from './market-orders-table';
import { SampleDataLoader } from '../sample-data-loader';

// Enhanced Trading Blotter with proper hierarchy display
export function EnhancedTradingBlotter() {
  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Header with data loading controls */}
      <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Trading Blotter</h1>
            <p className="text-[hsl(var(--trading-text-secondary))] text-sm">
              Three-level order hierarchy: Client Orders → Algo Orders → Market Orders
            </p>
            
            {/* Hierarchy explanation */}
            <div className="mt-4 p-3 bg-[hsl(var(--trading-bg))] rounded border border-[hsl(var(--trading-border))]">
              <h3 className="text-sm font-semibold mb-2">Order Hierarchy Structure:</h3>
              <div className="text-xs text-[hsl(var(--trading-text-secondary))] space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-l-4 border-blue-500 bg-blue-50/20"></div>
                  <span><strong>Client Order:</strong> Top-level order from institutional clients (1-3 algo orders)</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-3 h-3 border-l-4 border-orange-500 bg-orange-50/20"></div>
                  <span><strong>Algo Order:</strong> Trading algorithms like VWAP, Iceberg (hundreds of market orders)</span>
                </div>
                <div className="flex items-center gap-2 ml-8">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Market Order:</strong> Individual market executions (shown in linked table)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sample data controls */}
          <div className="flex-shrink-0">
            <SampleDataLoader />
          </div>
        </div>
      </div>
      
      {/* Main content area with split view */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Main order table - Client and Algo orders */}
        <div className="lg:col-span-2 min-h-0">
          <OrderTable />
        </div>
        
        {/* Linked market orders table */}
        <div className="lg:col-span-1 min-h-0">
          <MarketOrdersTable />
        </div>
      </div>
      
      {/* Instructions footer */}
      <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-3">
        <div className="text-xs text-[hsl(var(--trading-text-secondary))] space-y-1">
          <div><strong>Instructions:</strong></div>
          <div>• Click on Client or Algo orders in the main table to view related Market orders in the linked table</div>
          <div>• Use the expand/collapse buttons (▶/▼) to view the order hierarchy</div>
          <div>• Market orders are too numerous to display in the main table - they appear in the dedicated panel</div>
          <div>• Sort and filter orders using the column headers</div>
        </div>
      </div>
    </div>
  );
}