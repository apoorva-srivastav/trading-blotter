'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { ClientOrder, AlgoOrder, OrderLevel, BaseOrder } from '@repo/types';

// Simple chevron icons as atomic components
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Atomic components
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

// Molecular component for order row
interface OrderRowProps {
  order: ClientOrder | AlgoOrder;
  level: number;
  isExpanded: boolean;
  onToggleExpand: (orderId: number) => void;
  onSelectOrder: (orderId: number, level: OrderLevel) => void;
  isSelected: boolean;
  expandedRows: Record<number, boolean>;
  selectedOrder: { orderId: number; level: OrderLevel } | null;
}

const OrderRow = React.memo<OrderRowProps>(({ 
  order, 
  level, 
  isExpanded, 
  onToggleExpand, 
  onSelectOrder,
  isSelected,
  expandedRows,
  selectedOrder
}) => {
  const hasChildren = (order.level === 'Client' && (order as ClientOrder).algoOrders.length > 0) ||
                     (order.level === 'Algo' && (order as AlgoOrder).marketOrders.length > 0);

  const handleRowClick = useCallback(() => {
    onSelectOrder(order.orderId, order.level);
  }, [order.orderId, order.level, onSelectOrder]);

  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(order.orderId);
  }, [order.orderId, onToggleExpand]);

  // Calculate indentation based on hierarchy level
  const indentationStyle = {
    paddingLeft: `${16 + (level * 24)}px` // Base padding + level-based indentation
  };

  // Get level indicator styling
  const getLevelStyling = () => {
    switch (order.level) {
      case 'Client':
        return 'border-l-4 border-blue-500 bg-blue-50/10';
      case 'Algo':
        return 'border-l-4 border-orange-500 bg-orange-50/10';
      default:
        return '';
    }
  };

  return (
    <>
      <tr 
        className={`border-b border-[hsl(var(--trading-border))] hover:bg-[hsl(var(--trading-bg))] cursor-pointer transition-colors ${
          isSelected ? 'bg-[hsl(var(--trading-accent))] bg-opacity-20' : ''
        } ${getLevelStyling()}`}
        onClick={handleRowClick}
      >
        <td className="py-2" style={indentationStyle}>
          <div className="flex items-center gap-2">
            {/* Hierarchy level indicator */}
            <div className="flex items-center gap-1">
              {level > 0 && (
                <div className="flex items-center">
                  {/* Connection lines for visual hierarchy */}
                  <div className="w-4 h-px bg-[hsl(var(--trading-border))] mr-1"></div>
                  <div className="w-2 h-2 border border-[hsl(var(--trading-border))] rounded-full bg-[hsl(var(--trading-surface))] mr-2"></div>
                </div>
              )}
              {hasChildren && (
                <button
                  onClick={handleExpandClick}
                  className="p-1 hover:bg-[hsl(var(--trading-border))] rounded flex-shrink-0"
                >
                  {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </button>
              )}
              {!hasChildren && level > 0 && (
                <div className="w-6 h-6 flex-shrink-0"></div> // Spacer for alignment
              )}
            </div>
            
            {/* Order ID and level badge */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium">{order.orderId}</span>
              
              {/* Level badge */}
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                order.level === 'Client' 
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-orange-100 text-orange-800 border border-orange-200'
              }`}>
                {order.level === 'Client' ? 'CLIENT' : 'ALGO'}
              </span>
              
              {order.level === 'Algo' && (
                <span className="text-xs text-[hsl(var(--trading-text-secondary))] bg-[hsl(var(--trading-bg))] px-2 py-1 rounded border">
                  {(order as AlgoOrder).algorithm}
                </span>
              )}
            </div>
          </div>
        </td>
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
        <td className="px-4 py-2 text-[hsl(var(--trading-text-secondary))] font-mono text-xs">
          {new Date(order.updated).toLocaleTimeString()}
        </td>
      </tr>
      
      {/* Render child orders when expanded */}
      {isExpanded && order.level === 'Client' && (
        (order as ClientOrder).algoOrders.map((algoOrder: AlgoOrder) => (
            <OrderRow
              key={`${algoOrder.orderId}-${algoOrder.level}`}
              order={algoOrder}
              level={level + 1}
              isExpanded={expandedRows[algoOrder.orderId] || false}
              onToggleExpand={onToggleExpand}
              onSelectOrder={onSelectOrder}
              isSelected={selectedOrder?.orderId === algoOrder.orderId && selectedOrder?.level === algoOrder.level}
              expandedRows={expandedRows}
              selectedOrder={selectedOrder}
            />
        ))
      )}
      
      {/* Render algo order's market orders when algo is expanded */}
      {isExpanded && order.level === 'Algo' && (
        (order as AlgoOrder).marketOrders.slice(0, 5).map((marketOrder) => (
          <tr 
            key={`market-${marketOrder.orderId}`}
            className="border-b border-[hsl(var(--trading-border))] bg-gray-50/20 text-xs"
          >
            <td className="py-1" style={{ paddingLeft: `${16 + ((level + 1) * 24)}px` }}>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-6 h-px bg-[hsl(var(--trading-border))] mr-1"></div>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                </div>
                <span className="font-mono text-xs text-[hsl(var(--trading-text-secondary))]">{marketOrder.orderId}</span>
                <span className="text-xs px-1 py-0.5 bg-green-100 text-green-800 rounded border">
                  MKT
                </span>
              </div>
            </td>
            <td className="py-1 text-[hsl(var(--trading-text-secondary))]">{marketOrder.symbol}</td>
            <td className="py-1">
              <span className={`px-1 py-0.5 rounded text-xs ${
                marketOrder.side.toLowerCase() === 'buy' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {marketOrder.side.toUpperCase()}
              </span>
            </td>
            <td className="py-1 text-right font-mono text-xs">{marketOrder.quantity.toLocaleString()}</td>
            <td className="py-1 text-right font-mono text-xs">{marketOrder.doneQuantity.toLocaleString()}</td>
            <td className="py-1 text-right font-mono text-xs">{marketOrder.donePercent.toFixed(1)}%</td>
            <td className="py-1 text-right font-mono text-xs">${marketOrder.price.toFixed(2)}</td>
            <td className="py-1 text-right font-mono text-xs">
              {marketOrder.averagePrice ? `$${marketOrder.averagePrice.toFixed(2)}` : '-'}
            </td>
            <td className="py-1">
              <span className={`px-1 py-0.5 rounded text-xs ${
                marketOrder.state.toLowerCase() === 'filled' 
                  ? 'bg-green-100 text-green-800'
                  : marketOrder.state.toLowerCase() === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {marketOrder.state.toUpperCase()}
              </span>
            </td>
            <td className="py-1 text-[hsl(var(--trading-text-secondary))] font-mono text-xs">
              {new Date(marketOrder.updated).toLocaleTimeString()}
            </td>
          </tr>
        ))
      )}
      
      {/* Show market orders count if there are more than 5 */}
      {isExpanded && order.level === 'Algo' && (order as AlgoOrder).marketOrders.length > 5 && (
        <tr className="border-b border-[hsl(var(--trading-border))] bg-gray-50/10">
          <td className="py-2" style={{ paddingLeft: `${16 + ((level + 1) * 24)}px` }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-px bg-[hsl(var(--trading-border))] mr-1"></div>
              <span className="text-xs text-[hsl(var(--trading-text-secondary))] italic">
                ... and {(order as AlgoOrder).marketOrders.length - 5} more market orders (see Market Orders panel)
              </span>
            </div>
          </td>
          <td colSpan={9} className="py-2"></td>
        </tr>
      )}
    </>
  );
});

OrderRow.displayName = 'OrderRow';

// Main OrderTable organism component
export function OrderTable() {
  const {
    getFilteredClientOrders,
    selectedOrder,
    expandedRows,
    toggleRowExpansion,
    setSelectedOrder,
    sortConfig,
    setSortConfig,
    pagination,
    clientOrders // Add direct access to clientOrders for debugging
  } = useOrderStore();

  const [virtualStart, setVirtualStart] = useState(0);
  const VISIBLE_ITEMS = 20;

  const filteredOrders = useMemo(() => {
    const filtered = getFilteredClientOrders();
    console.log('OrderTable - Raw clientOrders:', clientOrders.length);
    console.log('OrderTable - Filtered orders:', filtered.length);
    console.log('OrderTable - Sample filtered order:', filtered[0]);
    return filtered;
  }, [getFilteredClientOrders, clientOrders]);
  
  // Virtual scrolling for performance with thousands of rows
  const visibleOrders = useMemo(() => {
    const start = virtualStart;
    const end = Math.min(start + VISIBLE_ITEMS, filteredOrders.length);
    return filteredOrders.slice(start, end);
  }, [filteredOrders, virtualStart]);

  const handleSort = useCallback((column: keyof BaseOrder) => {
    const newDirection = sortConfig?.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, direction: newDirection });
  }, [sortConfig, setSortConfig]);

  const handleSelectOrder = useCallback((orderId: number, level: OrderLevel) => {
    setSelectedOrder({ orderId, level });
  }, [setSelectedOrder]);

  const getSortIcon = (column: string) => {
    if (sortConfig?.column !== column) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-[hsl(var(--trading-border))] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Client & Algo Orders</h2>
          <p className="text-sm text-[hsl(var(--trading-text-secondary))]">
            {filteredOrders.length} orders • Hierarchical view with indentation
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-l-4 border-blue-500 bg-blue-50/20"></div>
              <span className="text-[hsl(var(--trading-text-secondary))]">Client Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-l-4 border-orange-500 bg-orange-50/20"></div>
              <span className="text-[hsl(var(--trading-text-secondary))]">Algo Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-[hsl(var(--trading-text-secondary))]">Market Orders (preview)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-[hsl(var(--trading-text-secondary))]">Page:</span>
          <span>{pagination.page} of {Math.ceil(filteredOrders.length / pagination.pageSize)}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
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
                onClick={() => handleSort('updated')}
              >
                Updated {getSortIcon('updated')}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <OrderRow
                key={`${order.orderId}-${order.level}`}
                order={order}
                level={0}
                isExpanded={expandedRows[order.orderId] || false}
                onToggleExpand={toggleRowExpansion}
                onSelectOrder={handleSelectOrder}
                isSelected={selectedOrder?.orderId === order.orderId && selectedOrder?.level === order.level}
                expandedRows={expandedRows}
                selectedOrder={selectedOrder}
              />
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-[hsl(var(--trading-text-secondary))]">
                  <div className="space-y-2">
                    <div>No orders available</div>
                    <div className="text-xs text-yellow-500">
                      💡 Use the "Sample Data Controls" above to load test data
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Virtual scrolling controls */}
      {filteredOrders.length > VISIBLE_ITEMS && (
        <div className="p-2 border-t border-[hsl(var(--trading-border))] bg-[hsl(var(--trading-bg))]">
          <div className="flex justify-between items-center text-xs text-[hsl(var(--trading-text-secondary))]">
            <span>Showing {virtualStart + 1}-{Math.min(virtualStart + VISIBLE_ITEMS, filteredOrders.length)} of {filteredOrders.length}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setVirtualStart(Math.max(0, virtualStart - VISIBLE_ITEMS))}
                disabled={virtualStart === 0}
                className="px-2 py-1 bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setVirtualStart(Math.min(filteredOrders.length - VISIBLE_ITEMS, virtualStart + VISIBLE_ITEMS))}
                disabled={virtualStart + VISIBLE_ITEMS >= filteredOrders.length}
                className="px-2 py-1 bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded disabled:opacity-50"
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