'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { safeMockDataGenerator } from '@/utils/mock-data-generator';

export function ButtonClickTest() {
  const { clientOrders, setClientOrders, isLoading, error, setLoading, setError } = useOrderStore();
  const [clickLog, setClickLog] = useState<string[]>([]);

  const addClickLog = (message: string) => {
    setClickLog(prev => [...prev.slice(-8), `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const simulateOriginalButtonClick = async () => {
    addClickLog('🖱️ Simulating original Load Basic Data button click...');
    
    try {
      setLoading(true);
      setError(null);
      addClickLog('🔄 Set loading state to true');
      
      // Generate data exactly like the original component
      const basicData = safeMockDataGenerator.generateClientOrders(25);
      addClickLog(`📊 Generated ${basicData.length} client orders`);
      
      // Log first order details
      if (basicData.length > 0) {
        const firstOrder = basicData[0];
        addClickLog(`📋 First order: ID=${firstOrder.orderId}, Symbol=${firstOrder.symbol}`);
      }
      
      // Call setClientOrders exactly like the original
      setClientOrders(basicData);
      addClickLog('📦 Called setClientOrders with generated data');
      
      setLoading(false);
      addClickLog('✅ Set loading state to false');
      
      // Check store state after update
      setTimeout(() => {
        const currentOrders = useOrderStore.getState().clientOrders;
        addClickLog(`🔍 Store verification: ${currentOrders.length} orders in store`);
        
        if (currentOrders.length === basicData.length) {
          addClickLog('✅ SUCCESS: Data successfully loaded into store!');
        } else {
          addClickLog(`❌ MISMATCH: Expected ${basicData.length}, found ${currentOrders.length}`);
        }
      }, 100);
      
    } catch (error) {
      addClickLog(`❌ ERROR: ${error}`);
      setError(`Failed to load basic data: ${error}`);
      setLoading(false);
    }
  };

  const simulateEnhancedButtonClick = async () => {
    addClickLog('🖱️ Simulating Load Enhanced Data button click...');
    
    try {
      setLoading(true);
      setError(null);
      addClickLog('🔄 Set loading state to true');
      
      // Generate enhanced data exactly like the original component
      const enhancedData = safeMockDataGenerator.generateEnhancedSampleData();
      addClickLog(`📊 Generated ${enhancedData.length} enhanced orders`);
      
      // Log first order details
      if (enhancedData.length > 0) {
        const firstOrder = enhancedData[0];
        addClickLog(`📋 First order: ID=${firstOrder.orderId}, Symbol=${firstOrder.symbol}`);
      }
      
      // Call setClientOrders exactly like the original
      setClientOrders(enhancedData);
      addClickLog('📦 Called setClientOrders with enhanced data');
      
      setLoading(false);
      addClickLog('✅ Set loading state to false');
      
      // Check store state after update
      setTimeout(() => {
        const currentOrders = useOrderStore.getState().clientOrders;
        addClickLog(`🔍 Store verification: ${currentOrders.length} orders in store`);
        
        if (currentOrders.length === enhancedData.length) {
          addClickLog('✅ SUCCESS: Enhanced data successfully loaded!');
        } else {
          addClickLog(`❌ MISMATCH: Expected ${enhancedData.length}, found ${currentOrders.length}`);
        }
      }, 100);
      
    } catch (error) {
      addClickLog(`❌ ERROR: ${error}`);
      setError(`Failed to load enhanced data: ${error}`);
      setLoading(false);
    }
  };

  const clearAllData = () => {
    addClickLog('🗑️ Clearing all data...');
    setClientOrders([]);
    setError(null);
    addClickLog('✅ Data cleared');
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🖱️ Button Click Simulation</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={simulateOriginalButtonClick}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load Basic Data'}
        </button>
        
        <button
          onClick={simulateEnhancedButtonClick}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load Enhanced Data'}
        </button>
        
        <button
          onClick={clearAllData}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          Clear Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Orders Count</div>
          <div className="text-2xl font-bold text-blue-600">{clientOrders.length}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Loading</div>
          <div className={`text-2xl font-bold ${isLoading ? 'text-yellow-600' : 'text-green-600'}`}>
            {isLoading ? 'Yes' : 'No'}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Error</div>
          <div className={`text-2xl font-bold ${error ? 'text-red-600' : 'text-green-600'}`}>
            {error ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <div className="text-red-800 font-semibold">Error:</div>
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}
      
      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-48 overflow-y-auto">
        <div className="text-white font-bold mb-2">Click Log:</div>
        {clickLog.length === 0 ? (
          <div className="text-gray-500">Click a button to start testing...</div>
        ) : (
          clickLog.map((log, index) => (
            <div key={index} className="text-xs mb-1">{log}</div>
          ))
        )}
      </div>
    </div>
  );
}