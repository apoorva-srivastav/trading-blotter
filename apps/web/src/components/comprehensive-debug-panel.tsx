'use client';

import React from 'react';
import { TestDataLoading } from './test-data-loading';
import { DataLoadingDiagnostics } from './data-loading-diagnostics';
import { ButtonClickTest } from './button-click-test';
import { useOrderStore } from '@/stores/order-store';

export function ComprehensiveDebugPanel() {
  const { clientOrders, getFilteredClientOrders } = useOrderStore();
  const filteredOrders = getFilteredClientOrders();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">🔧 Comprehensive Data Loading Debug Panel</h1>
          <p className="text-gray-600 mb-4">
            This panel provides comprehensive debugging tools to identify why data isn't loading in the orders table.
            Use the tools below to test each component of the data pipeline.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{clientOrders.length}</div>
              <div className="text-sm text-gray-600">Raw Store Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredOrders.length}</div>
              <div className="text-sm text-gray-600">Filtered Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {clientOrders.reduce((sum, order) => sum + (order.algoOrders?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Algo Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {clientOrders.reduce((sum, order) => 
                  sum + (order.algoOrders?.reduce((algoSum, algo) => 
                    algoSum + (algo.marketOrders?.length || 0), 0) || 0), 0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Market Orders</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TestDataLoading />
          <DataLoadingDiagnostics />
        </div>
        
        <ButtonClickTest />
        
        {clientOrders.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Current Data Sample</h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-sm overflow-x-auto">
              <pre>{JSON.stringify(clientOrders.slice(0, 2), null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}