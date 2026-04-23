'use client';

import React from 'react';
import { OrderTable } from './order-table';
import { MarketOrdersTable } from './market-orders-table';
import { OrderHierarchyDisplay } from './order-hierarchy-display';
import { SampleDataLoader } from '../sample-data-loader';

// Complete Trading Blotter with proper three-level hierarchy implementation
export function TradingBlotterWithHierarchy() {
  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Trading Blotter - Order Hierarchy</h1>
            <p className="text-[hsl(var(--trading-text-secondary))] text-sm">
              Hierarchical order management: Client Orders → Algo Orders → Market Orders
            </p>
          </div>
          <SampleDataLoader />
        </div>
      </div>
      
      {/* Hierarchy overview */}
      <OrderHierarchyDisplay />
      
      {/* Main trading interface */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-5 gap-4 min-h-0">
        {/* Main order table - Client and Algo orders */}
        <div className="xl:col-span-3 min-h-0">
          <OrderTable />
        </div>
        
        {/* Linked market orders table */}
        <div className="xl:col-span-2 min-h-0">
          <MarketOrdersTable />
        </div>
      </div>
      
      {/* Usage instructions */}
      <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-3">
        <div className="text-xs text-[hsl(var(--trading-text-secondary))] space-y-1">
          <div><strong>How to use the Order Hierarchy:</strong></div>
          <div>• <strong>Client Orders:</strong> Click to view all related market orders across all algo orders</div>
          <div>• <strong>Algo Orders:</strong> Click to view specific market orders for that algorithm</div>
          <div>• <strong>Market Orders:</strong> Too many to display in main table - shown in dedicated linked panel</div>
          <div>• <strong>Expansion:</strong> Use ▶/▼ buttons to expand/collapse the hierarchy in the main table</div>
          <div>• <strong>Selection:</strong> Selected orders are highlighted and their market orders appear in the right panel</div>
        </div>
      </div>
    </div>
  );
}