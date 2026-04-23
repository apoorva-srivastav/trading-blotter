'use client';

import React from 'react';
import { useOrderStore } from '@/stores/order-store';

export function MinimalTableTest() {
  const { clientOrders, getFilteredClientOrders } = useOrderStore();
  const filteredOrders = getFilteredClientOrders();

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📋 Minimal Table Test</h2>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          Raw Orders: {clientOrders.length} | Filtered Orders: {filteredOrders.length}
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-lg">No orders to display</div>
          <div className="text-sm">Use the data loading controls above to add test data</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left">Order ID</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Symbol</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Side</th>
                <th className="border border-gray-300 px-3 py-2 text-right">Quantity</th>
                <th className="border border-gray-300 px-3 py-2 text-left">State</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Algos</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 10).map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-mono">{order.orderId}</td>
                  <td className="border border-gray-300 px-3 py-2 font-semibold">{order.symbol}</td>
                  <td className="border border-gray-300 px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.side === 'Buy' ? 'bg-green-100 text-green-800' :
                      order.side === 'Sell' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.side}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono">
                    {order.quantity.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.state === 'Filled' ? 'bg-green-100 text-green-800' :
                      order.state === 'Partially Filled' ? 'bg-yellow-100 text-yellow-800' :
                      order.state === 'New' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.state}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {order.algoOrders?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length > 10 && (
            <div className="mt-3 text-sm text-gray-600 text-center">
              Showing first 10 of {filteredOrders.length} orders
            </div>
          )}
        </div>
      )}
    </div>
  );
}