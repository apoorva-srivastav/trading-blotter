'use client';

import React, { useMemo } from 'react';
import { useOrderStore } from '@/stores/order-store';


// Component to display order hierarchy statistics and relationships
export function OrderHierarchyDisplay() {
  const { getFilteredClientOrders, selectedOrder, getAlgoOrdersForClient, getMarketOrdersForAlgo } = useOrderStore();
  
  const hierarchyStats = useMemo(() => {
    const clientOrders = getFilteredClientOrders();
    let totalAlgoOrders = 0;
    let totalMarketOrders = 0;
    let totalValue = 0;
    let totalDoneValue = 0;
    
    clientOrders.forEach(clientOrder => {
      totalValue += clientOrder.orderValue;
      totalDoneValue += clientOrder.doneValue;
      
      clientOrder.algoOrders.forEach(algoOrder => {
        totalAlgoOrders++;
        totalValue += algoOrder.orderValue;
        totalDoneValue += algoOrder.doneValue;
        
        totalMarketOrders += algoOrder.marketOrders.length;
        algoOrder.marketOrders.forEach(marketOrder => {
          totalValue += marketOrder.orderValue;
          totalDoneValue += marketOrder.doneValue;
        });
      });
    });
    
    const fillRate = totalValue > 0 ? (totalDoneValue / totalValue) * 100 : 0;
    
    return {
      clientOrders: clientOrders.length,
      algoOrders: totalAlgoOrders,
      marketOrders: totalMarketOrders,
      totalValue,
      totalDoneValue,
      fillRate
    };
  }, [getFilteredClientOrders]);
  
  const selectedOrderDetails = useMemo(() => {
    if (!selectedOrder) return null;
    
    if (selectedOrder.level === 'Client') {
      const algoOrders = getAlgoOrdersForClient(selectedOrder.orderId);
      const totalMarketOrders = algoOrders.reduce((sum, algo) => {
        return sum + getMarketOrdersForAlgo(algo.orderId).length;
      }, 0);
      
      return {
        type: 'Client Order',
        id: selectedOrder.orderId,
        children: algoOrders.length,
        grandChildren: totalMarketOrders,
        childType: 'Algo Orders',
        grandChildType: 'Market Orders'
      };
    } else if (selectedOrder.level === 'Algo') {
      const marketOrders = getMarketOrdersForAlgo(selectedOrder.orderId);
      
      return {
        type: 'Algo Order',
        id: selectedOrder.orderId,
        children: marketOrders.length,
        grandChildren: 0,
        childType: 'Market Orders',
        grandChildType: ''
      };
    }
    
    return null;
  }, [selectedOrder, getAlgoOrdersForClient, getMarketOrdersForAlgo]);
  
  return (
    <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Order Hierarchy Overview</h3>
      
      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-[hsl(var(--trading-bg))] rounded border border-[hsl(var(--trading-border))]">
          <div className="text-2xl font-bold text-blue-600">{hierarchyStats.clientOrders}</div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))] mt-1">Client Orders</div>
        </div>
        <div className="text-center p-3 bg-[hsl(var(--trading-bg))] rounded border border-[hsl(var(--trading-border))]">
          <div className="text-2xl font-bold text-orange-600">{hierarchyStats.algoOrders}</div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))] mt-1">Algo Orders</div>
        </div>
        <div className="text-center p-3 bg-[hsl(var(--trading-bg))] rounded border border-[hsl(var(--trading-border))]">
          <div className="text-2xl font-bold text-green-600">{hierarchyStats.marketOrders.toLocaleString()}</div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))] mt-1">Market Orders</div>
        </div>
        <div className="text-center p-3 bg-[hsl(var(--trading-bg))] rounded border border-[hsl(var(--trading-border))]">
          <div className="text-2xl font-bold text-purple-600">{hierarchyStats.fillRate.toFixed(1)}%</div>
          <div className="text-xs text-[hsl(var(--trading-text-secondary))] mt-1">Fill Rate</div>
        </div>
      </div>
      
      {/* Hierarchy Visualization */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3">Hierarchy Structure</h4>
        <div className="flex items-center justify-center space-x-8">
          {/* Client Level */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2">
              CLIENT
            </div>
            <div className="text-xs text-[hsl(var(--trading-text-secondary))]">
              {hierarchyStats.clientOrders} orders
            </div>
          </div>
          
          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-px bg-[hsl(var(--trading-border))] mb-1"></div>
            <div className="text-xs text-[hsl(var(--trading-text-secondary))]">1-3</div>
          </div>
          
          {/* Algo Level */}
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2">
              ALGO
            </div>
            <div className="text-xs text-[hsl(var(--trading-text-secondary))]">
              {hierarchyStats.algoOrders} orders
            </div>
          </div>
          
          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-px bg-[hsl(var(--trading-border))] mb-1"></div>
            <div className="text-xs text-[hsl(var(--trading-text-secondary))]">5-50+</div>
          </div>
          
          {/* Market Level */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2">
              MARKET
            </div>
            <div className="text-xs text-[hsl(var(--trading-text-secondary))]">
              {hierarchyStats.marketOrders.toLocaleString()} orders
            </div>
          </div>
        </div>
      </div>
      
      {/* Selected Order Details */}
      {selectedOrderDetails && (
        <div className="p-3 bg-[hsl(var(--trading-accent))] bg-opacity-10 rounded border border-[hsl(var(--trading-accent))] border-opacity-30">
          <h4 className="text-sm font-semibold mb-2">Selected Order Details</h4>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">{selectedOrderDetails.type} #{selectedOrderDetails.id}</span>
            </div>
            <div className="text-[hsl(var(--trading-text-secondary))]">
              • {selectedOrderDetails.children} {selectedOrderDetails.childType}
              {selectedOrderDetails.grandChildren > 0 && (
                <span> → {selectedOrderDetails.grandChildren.toLocaleString()} {selectedOrderDetails.grandChildType}</span>
              )}
            </div>
            <div className="text-xs text-[hsl(var(--trading-text-secondary))] mt-2">
              💡 Market orders for this selection are shown in the linked table on the right
            </div>
          </div>
        </div>
      )}
      
      {!selectedOrder && (
        <div className="p-3 bg-[hsl(var(--trading-bg))] rounded border border-[hsl(var(--trading-border))] text-center">
          <div className="text-sm text-[hsl(var(--trading-text-secondary))]">
            Select a Client or Algo order to see detailed hierarchy information
          </div>
        </div>
      )}
    </div>
  );
}