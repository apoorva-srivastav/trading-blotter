'use client';

import React, { useMemo, useState } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { MarketOrder } from '@repo/types';

// Atomic component for market order row
const MarketOrderRow = React.memo<{ order: MarketOrder }>(({ order }) => {
  return (
    <tr className="border-b border-[hsl(var(--trading-border))] hover:bg-[hsl(var(--trading-bg))] text-xs">
      <td className="px-3 py-2 font-mono">{order.orderId}</td>
      <td className="px-3 py-2">{order.venue || '-'}</td>
      <td className="px-3 py-2 text-right font-mono">{order.quantity.toLocaleString()}</td>
      <td className="px-3 py-2 text-right font-mono">${order.price.toFixed(2)}</td>
      <td className="px-3 py-2 text-right font-mono">
        {order.averagePrice ? `$${order.averagePrice.toFixed(2)}` : '-'}
      </td>
      <td className="px-3 py-2">
        <span className={`px-1 py-0.5 rounded text-xs font-medium ${
          order.state === 'Filled' ? 'bg-green-500 text-white' :
          order.state === 'Partially Filled' ? 'bg-yellow-500 text-white' :
          order.state === 'New' ? 'bg-blue-500 text-white' :
          order.state === 'Cancelled' ? 'bg-gray-500 text-white' :
          order.state === 'Rejected' ? 'bg-red-500 text-white' :
          'bg-gray-500 text-white'
        }`}>
          {order.state}
        </span>
      </td>
      <td className="px-3 py-2 text-[hsl(var(--trading-text-secondary))] font-mono">
        {order.executionTime ? new Date(order.executionTime).toLocaleTimeString() : '-'}
      </td>
    </tr>
  );
});

MarketOrderRow.displayName = 'MarketOrderRow';

// Main MarketOrdersPanel organism component
export function MarketOrdersPanel() {
  const { selectedOrder, getMarketOrdersForAlgo, getAlgoOrdersForClient } = useOrderStore();
  const [virtualStart, setVirtualStart] = useState(0);
  const VISIBLE_ITEMS = 25;

  const marketOrders = useMemo(() => {
    if (!selectedOrder) return [];
    
    if (selectedOrder.level === 'Algo') {
      return getMarketOrdersForAlgo(selectedOrder.orderId);
    } else if (selectedOrder.level === 'Client') {
      // Show all market orders for all algo orders under this client order
      const algoOrders = getAlgoOrdersForClient(selectedOrder.orderId);
      return algoOrders.flatMap(algo => algo.marketOrders);
    }
    
    return [];
  }, [selectedOrder, getMarketOrdersForAlgo, getAlgoOrdersForClient]);

  // Virtual scrolling for performance
  const visibleOrders = useMemo(() => {
    const start = virtualStart;
    const end = Math.min(start + VISIBLE_ITEMS, marketOrders.length);
    return marketOrders.slice(start, end);
  }, [marketOrders, virtualStart]);

  const totalValue = useMemo(() => {
    return marketOrders.reduce((sum, order) => sum + order.orderValue, 0);
  }, [marketOrders]);

  const totalDoneValue = useMemo(() => {
    return marketOrders.reduce((sum, order) => sum + order.doneValue, 0);
  }, [marketOrders]);

  const fillRate = totalValue > 0 ? (totalDoneValue / totalValue) * 100 : 0;

  return (
    <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-[hsl(var(--trading-border))]">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">Market Orders</h2>
            <p className="text-sm text-[hsl(var(--trading-text-secondary))] mt-1">
              {selectedOrder 
                ? `${marketOrders.length} orders for ${selectedOrder.level} Order #${selectedOrder.orderId}`
                : 'Select a Client or Algo order to view market orders'
              }
            </p>
          </div>
          {marketOrders.length > 0 && (
            <div className="text-right text-sm">
              <div className="text-[hsl(var(--trading-text-secondary))]">Fill Rate</div>
              <div className={`font-semibold ${
                fillRate >= 90 ? 'text-green-500' :
                fillRate >= 50 ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {fillRate.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {!selectedOrder ? (
          <div className="flex items-center justify-center h-full text-[hsl(var(--trading-text-secondary))]">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-lg font-medium mb-2">No Order Selected</div>
              <div className="text-sm">
                Click on a Client or Algo order in the main table<br />
                to view its associated market orders
              </div>
            </div>
          </div>
        ) : marketOrders.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[hsl(var(--trading-text-secondary))]">
            <div className="text-center">
              <div className="text-4xl mb-4">📑</div>
              <div className="text-lg font-medium mb-2">No Market Orders</div>
              <div className="text-sm">
                No market orders found for the selected {selectedOrder.level.toLowerCase()} order
              </div>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[hsl(var(--trading-bg))] sticky top-0 z-10">
              <tr className="text-xs">
                <th className="px-3 py-2 text-left">Order ID</th>
                <th className="px-3 py-2 text-left">Venue</th>
                <th className="px-3 py-2 text-right">Quantity</th>
                <th className="px-3 py-2 text-right">Price</th>
                <th className="px-3 py-2 text-right">Avg Price</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Execution Time</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <MarketOrderRow key={order.orderId} order={order} />
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Virtual scrolling controls for large datasets */}
      {marketOrders.length > VISIBLE_ITEMS && (
        <div className="p-2 border-t border-[hsl(var(--trading-border))] bg-[hsl(var(--trading-bg))]">
          <div className="flex justify-between items-center text-xs text-[hsl(var(--trading-text-secondary))]">
            <span>
              Showing {virtualStart + 1}-{Math.min(virtualStart + VISIBLE_ITEMS, marketOrders.length)} of {marketOrders.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setVirtualStart(Math.max(0, virtualStart - VISIBLE_ITEMS))}
                disabled={virtualStart === 0}
                className="px-2 py-1 bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setVirtualStart(Math.min(marketOrders.length - VISIBLE_ITEMS, virtualStart + VISIBLE_ITEMS))}
                disabled={virtualStart + VISIBLE_ITEMS >= marketOrders.length}
                className="px-2 py-1 bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Summary footer */}
      {marketOrders.length > 0 && (
        <div className="p-3 border-t border-[hsl(var(--trading-border))] bg-[hsl(var(--trading-bg))] text-xs">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="text-[hsl(var(--trading-text-secondary))]">Total Value:</span>
              <span className="ml-2 font-mono">${totalValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[hsl(var(--trading-text-secondary))]">Executed:</span>
              <span className="ml-2 font-mono">${totalDoneValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[hsl(var(--trading-text-secondary))]">Remaining:</span>
              <span className="ml-2 font-mono">${(totalValue - totalDoneValue).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}