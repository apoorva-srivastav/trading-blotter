'use client';

import React from 'react';
import { useOrderStore } from '@/stores/order-store';

export function SimpleOrderDisplay() {
  const { clientOrders } = useOrderStore();

  if (clientOrders.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800 font-medium">⚠️ No Orders Found</div>
        <div className="text-yellow-600 text-sm mt-1">
          The order store is empty. Click "Load Basic Data" or "Load Enhanced Data" to populate orders.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="text-green-800 font-medium mb-3">✅ Orders Found: {clientOrders.length}</div>
      
      <div className="space-y-2">
        {clientOrders.slice(0, 3).map((order) => (
          <div key={order.orderId} className="bg-white p-3 rounded border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-sm font-bold">#{order.orderId}</div>
                <div className="text-sm text-gray-600">
                  {order.symbol} | {order.side} | {order.quantity.toLocaleString()} @ ${order.price}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Client: {order.clientName}</div>
                <div className="text-xs text-gray-500">Algos: {order.algoOrders.length}</div>
              </div>
            </div>
            
            {order.algoOrders.length > 0 && (
              <div className="mt-2 pl-4 border-l-2 border-green-200">
                <div className="text-xs text-gray-600 font-medium">Algo Orders:</div>
                {order.algoOrders.slice(0, 2).map((algo) => (
                  <div key={algo.orderId} className="text-xs text-gray-500 mt-1">
                    #{algo.orderId} {algo.algorithm} - {algo.marketOrders.length} market orders
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {clientOrders.length > 3 && (
          <div className="text-center text-sm text-gray-500 py-2">
            ... and {clientOrders.length - 3} more orders
          </div>
        )}
      </div>
    </div>
  );
}