'use client';

import React, { useEffect, useState } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { safeMockDataGenerator } from '@/utils/mock-data-generator';

export function DebugDataFlow() {
  const { clientOrders, setClientOrders, isLoading, error } = useOrderStore();
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const testDataGeneration = () => {
    addDebugInfo('🔧 Testing data generation...');
    
    try {
      // Use safe mock data generator
      const testData = safeMockDataGenerator.generateClientOrders(5);
      addDebugInfo(`✅ Generated ${testData.length} test orders`);
      addDebugInfo(`📊 First order: ID=${testData[0]?.orderId}, Symbol=${testData[0]?.symbol}`);
      
      // Test store directly with null check
      if (typeof setClientOrders === 'function') {
        setClientOrders(testData);
        addDebugInfo('📦 Data sent to store');
      } else {
        addDebugInfo('❌ setClientOrders is not a function');
        return;
      }
      
      // Check store state
      setTimeout(() => {
        try {
          const currentOrders = useOrderStore.getState().clientOrders;
          addDebugInfo(`🔍 Store now has ${currentOrders.length} orders`);
        } catch (storeError) {
          addDebugInfo(`❌ Store access error: ${storeError}`);
        }
      }, 100);
      
    } catch (error) {
      addDebugInfo(`❌ Error: ${error}`);
      console.error('Data generation error:', error);
    }
  };

  const clearData = () => {
    try {
      if (typeof setClientOrders === 'function') {
        setClientOrders([]);
        addDebugInfo('🗑️ Cleared all data');
      } else {
        addDebugInfo('❌ setClientOrders is not a function');
      }
    } catch (error) {
      addDebugInfo(`❌ Clear error: ${error}`);
      console.error('Clear data error:', error);
    }
  };

  useEffect(() => {
    addDebugInfo(`📊 Store state: ${clientOrders.length} orders, loading: ${isLoading}, error: ${error || 'none'}`);
  }, [clientOrders.length, isLoading, error]);

  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-white">🔍 Data Flow Debug Console</h3>
        <div className="flex gap-2">
          <button
            onClick={testDataGeneration}
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Test Data Gen
          </button>
          <button
            onClick={clearData}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {debugInfo.map((info, index) => (
          <div key={index} className="text-xs">
            {info}
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-gray-400">Orders in Store:</span>
          <div className="text-white font-bold">{clientOrders.length}</div>
        </div>
        <div>
          <span className="text-gray-400">Loading:</span>
          <div className={`font-bold ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
            {isLoading ? 'Yes' : 'No'}
          </div>
        </div>
        <div>
          <span className="text-gray-400">Error:</span>
          <div className={`font-bold ${error ? 'text-red-400' : 'text-green-400'}`}>
            {error ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
      
      {clientOrders.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-gray-400 text-xs mb-1">Sample Order Data:</div>
          <div className="text-xs text-yellow-400">
            ID: {clientOrders[0]?.orderId} | Symbol: {clientOrders[0]?.symbol} | 
            Side: {clientOrders[0]?.side} | Algos: {clientOrders[0]?.algoOrders?.length || 0}
          </div>
        </div>
      )}
    </div>
  );
}