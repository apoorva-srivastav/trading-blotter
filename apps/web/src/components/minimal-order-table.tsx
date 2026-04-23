'use client';

import React from 'react';
import { useOrderStore } from '@/stores/order-store';

export function MinimalOrderTable() {
  const { clientOrders } = useOrderStore();

  if (clientOrders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Minimal Order Table</h3>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No orders to display</div>
          <div className="text-sm text-yellow-600">💡 Load some data using the buttons above</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">📋 Minimal Order Table</h3>
        <div className="text-sm text-gray-600">{clientOrders.length} orders loaded</div>
      </div>
      
      <div className="overflow-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-left">Side</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-center">Algos</th>
            </tr>
          </thead>
          <tbody>
            {clientOrders.map((order, index) => (
              <tr key={order.orderId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-2 font-mono">{order.orderId}</td>
                <td className="px-4 py-2 font-bold">{order.symbol}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.side === 'Buy' ? 'bg-green-100 text-green-800' :
                    order.side === 'Sell' ? 'bg-red-100 text-red-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {order.side}
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-mono">{order.quantity.toLocaleString()}</td>
                <td className="px-4 py-2 text-right font-mono">${order.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">{order.clientName}</td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {order.algoOrders.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}