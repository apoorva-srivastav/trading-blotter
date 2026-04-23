'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { MarketOrder } from '@repo/types';

// Atomic components for market orders table
const OrderStatusBadge = ({ state }: { state: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'filled': return 'bg-green-500 text-white';
      case 'partially filled': return 'bg-yellow-500 text-white';
      case 'new': case 'pending': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(state)}`}>
      {state.toUpperCase()}
    </span>
  );
};

const SideBadge = ({ side }: { side: string }) => {
  const getSideColor = (side: string) => {
    switch (side.toLowerCase()) {
      case 'buy': return 'bg-[hsl(var(--trading-buy))] text-white';
      case 'sell': return 'bg-[hsl(var(--trading-sell))] text-white';
      case 'short sell': return 'bg-[hsl(var(--trading-short))] text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${getSideColor(side)}`}>
      {side.toUpperCase()}
    </span>
  );
};

// Market Order Row Component
interface MarketOrderRowProps {
  order: MarketOrder;
  isSelected: boolean;
  onSelect: (orderId: number) => void;
}

const MarketOrderRow = React.memo<MarketOrderRowProps>(({ order, isSelected, onSelect }) => {
  const handleRowClick = useCallback(() => {
    onSelect(order.orderId);
  }, [order.orderId, onSelect]);

  return (
    <tr 
      className={`border-b border-[hsl(var(--trading-border))] hover:bg-[hsl(var(--trading-bg))] cursor-pointer transition-colors ${
        isSelected ? 'bg-[hsl(var(--trading-accent))] bg-opacity-20' : ''
      }`}
      onClick={handleRowClick}
    >
      <td className="px-4 py-2 font-mono text-sm font-medium">{order.orderId}</td>
      <td className="px-4 py-2 font-semibold">{order.symbol}</td>
      <td className="px-4 py-2">
        <SideBadge side={order.side} />
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {order.quantity.toLocaleString()}
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {order.doneQuantity.toLocaleString()}
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {order.donePercent.toFixed(1)}%
      </td>
      <td className="px-4 py-2 text-right font-mono">
        ${order.price.toFixed(2)}
      </td>
      <td className="px-4 py-2 text-right font-mono">
        {order.averagePrice ? `$${order.averagePrice.toFixed(2)}` : '-'}
      </td>
      <td className="px-4 py-2">
        <OrderStatusBadge state={order.state} />
      </td>
      <td className="px-4 py-2 text-[hsl(var(--trading-text-secondary))] text-xs">
        {order.venue || '-'}
      </td>
      <td className="px-4 py-2 text-[hsl(var(--trading-text-secondary))] font-mono text-xs">
        {order.executionTime ? new Date(order.executionTime).toLocaleTimeString() : '-'}
      </td>
      <td className="px-4 py-2 text-[hsl(var(--trading-text-secondary))] font-mono text-xs">
        {new Date(order.updated).toLocaleTimeString()}
      </td>
    </tr>
  );
});

MarketOrderRow.displayName = 'MarketOrderRow';

// Main Market Orders Table Component
export function MarketOrdersTable() {
  const { selectedOrder, getMarketOrdersForAlgo, getAlgoOrdersForClient } = useOrderStore();
  const [selectedMarketOrder, setSelectedMarketOrder] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ column: keyof MarketOrder; direction: 'asc' | 'desc' } | null>(null);
  
  const ITEMS_PER_PAGE = 50;

  // Get market orders based on selected order
  const marketOrders = useMemo(() => {
    if (!selectedOrder) return [];
    
    if (selectedOrder.level === 'Algo') {
      // Show market orders for selected algo order
      return getMarketOrdersForAlgo(selectedOrder.orderId);
    } else if (selectedOrder.level === 'Client') {
      // Show all market orders for all algo orders under the selected client order
      const algoOrders = getAlgoOrdersForClient(selectedOrder.orderId);
      const allMarketOrders: MarketOrder[] = [];
      
      algoOrders.forEach(algoOrder => {
        const marketOrdersForAlgo = getMarketOrdersForAlgo(algoOrder.orderId);
        allMarketOrders.push(...marketOrdersForAlgo);
      });
      
      return allMarketOrders;
    }
    
    return [];
  }, [selectedOrder, getMarketOrdersForAlgo, getAlgoOrdersForClient]);

  // Apply sorting
  const sortedMarketOrders = useMemo(() => {
    if (!sortConfig) return marketOrders;
    
    return [...marketOrders].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [marketOrders, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedMarketOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedMarketOrders.slice(start, end);
  }, [sortedMarketOrders, currentPage]);

  const handleSort = useCallback((column: keyof MarketOrder) => {
    const newDirection = sortConfig?.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, direction: newDirection });
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortConfig]);

  const handleSelectMarketOrder = useCallback((orderId: number) => {
    setSelectedMarketOrder(orderId === selectedMarketOrder ? null : orderId);
  }, [selectedMarketOrder]);

  const getSortIcon = (column: string) => {
    if (sortConfig?.column !== column) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getParentOrderInfo = () => {
    if (!selectedOrder) return null;
    
    if (selectedOrder.level === 'Client') {
      const algoCount = getAlgoOrdersForClient(selectedOrder.orderId).length;
      return {
        type: 'Client Order',
        id: selectedOrder.orderId,
        details: `${algoCount} algo order(s)`
      };
    } else if (selectedOrder.level === 'Algo') {
      return {
        type: 'Algo Order',
        id: selectedOrder.orderId,
        details: 'Market executions'
      };
    }
    
    return null;
  };

  const parentInfo = getParentOrderInfo();

  return (
    <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-[hsl(var(--trading-border))]">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">Market Orders</h2>
            {parentInfo ? (
              <div className="mt-2">
                <p className="text-sm text-[hsl(var(--trading-text-secondary))]">
                  Showing market orders for <span className="font-medium text-[hsl(var(--trading-text))]">{parentInfo.type} #{parentInfo.id}</span>
                </p>
                <p className="text-xs text-[hsl(var(--trading-text-secondary))] mt-1">
                  {sortedMarketOrders.length} market orders • {parentInfo.details}
                </p>
              </div>
            ) : (
              <p className="text-sm text-[hsl(var(--trading-text-secondary))] mt-2">
                Select a Client or Algo order to view related market orders
              </p>
            )}
          </div>
          
          {sortedMarketOrders.length > 0 && (
            <div className="text-sm text-[hsl(var(--trading-text-secondary))]">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-[hsl(var(--trading-text-secondary))]">Market Order</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[hsl(var(--trading-text-secondary))]">Real-time execution data</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {sortedMarketOrders.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--trading-bg))] sticky top-0 z-10">
              <tr>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('orderId')}
                >
                  Order ID {getSortIcon('orderId')}
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('symbol')}
                >
                  Symbol {getSortIcon('symbol')}
                </th>
                <th className="px-4 py-3 text-left">Side</th>
                <th 
                  className="px-4 py-3 text-right cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('quantity')}
                >
                  Quantity {getSortIcon('quantity')}
                </th>
                <th 
                  className="px-4 py-3 text-right cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('doneQuantity')}
                >
                  Done Qty {getSortIcon('doneQuantity')}
                </th>
                <th 
                  className="px-4 py-3 text-right cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('donePercent')}
                >
                  Fill % {getSortIcon('donePercent')}
                </th>
                <th 
                  className="px-4 py-3 text-right cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('price')}
                >
                  Price {getSortIcon('price')}
                </th>
                <th className="px-4 py-3 text-right">Avg Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('venue')}
                >
                  Venue {getSortIcon('venue')}
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('executionTime')}
                >
                  Execution Time {getSortIcon('executionTime')}
                </th>
                <th 
                  className="px-4 py-3 text-left cursor-pointer hover:bg-[hsl(var(--trading-border))] transition-colors"
                  onClick={() => handleSort('updated')}
                >
                  Updated {getSortIcon('updated')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <MarketOrderRow
                  key={order.orderId}
                  order={order}
                  isSelected={selectedMarketOrder === order.orderId}
                  onSelect={handleSelectMarketOrder}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-3">
              {!selectedOrder ? (
                <>
                  <div className="text-[hsl(var(--trading-text-secondary))] text-lg">📋</div>
                  <div className="text-[hsl(var(--trading-text-secondary))]">
                    Select a Client or Algo order from the main table
                  </div>
                  <div className="text-xs text-[hsl(var(--trading-text-secondary))]">
                    Market orders will appear here when you click on a parent order
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[hsl(var(--trading-text-secondary))] text-lg">📊</div>
                  <div className="text-[hsl(var(--trading-text-secondary))]">
                    No market orders found for selected {selectedOrder.level.toLowerCase()} order
                  </div>
                  <div className="text-xs text-[hsl(var(--trading-text-secondary))]">
                    Market orders may not have been generated yet
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-[hsl(var(--trading-border))] bg-[hsl(var(--trading-bg))]">
          <div className="flex justify-between items-center">
            <div className="text-xs text-[hsl(var(--trading-text-secondary))]">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedMarketOrders.length)} of {sortedMarketOrders.length} market orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-xs bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded disabled:opacity-50 hover:bg-[hsl(var(--trading-bg))] transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-xs text-[hsl(var(--trading-text-secondary))]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-xs bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded disabled:opacity-50 hover:bg-[hsl(var(--trading-bg))] transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}