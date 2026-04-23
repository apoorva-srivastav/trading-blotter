'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { safeMockDataGenerator } from '@/utils/mock-data-generator';

export function TestDataLoading() {
  const { clientOrders, setClientOrders, isLoading, error } = useOrderStore();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
    console.log(result);
  };

  const runComprehensiveTest = async () => {
    setTestResults([]);
    addTestResult('🧪 Starting comprehensive data loading test...');
    
    try {
      // Test 1: Check store functions
      addTestResult('1️⃣ Testing store functions...');
      if (typeof setClientOrders !== 'function') {
        addTestResult('❌ setClientOrders is not a function!');
        return;
      }
      addTestResult('✅ setClientOrders function exists');
      
      // Test 2: Check data generator
      addTestResult('2️⃣ Testing data generator...');
      const testData = safeMockDataGenerator.generateClientOrders(3);
      addTestResult(`✅ Generated ${testData.length} orders`);
      addTestResult(`📊 Sample order: ID=${testData[0]?.orderId}, Symbol=${testData[0]?.symbol}`);
      
      // Test 3: Test store update
      addTestResult('3️⃣ Testing store update...');
      const beforeCount = clientOrders.length;
      addTestResult(`📊 Orders before: ${beforeCount}`);
      
      setClientOrders(testData);
      addTestResult('✅ setClientOrders called');
      
      // Wait for state update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Test 4: Verify store state
      addTestResult('4️⃣ Verifying store state...');
      const afterCount = useOrderStore.getState().clientOrders.length;
      addTestResult(`📊 Orders after: ${afterCount}`);
      
      if (afterCount === testData.length) {
        addTestResult('✅ Store updated successfully!');
      } else {
        addTestResult(`❌ Store update failed! Expected ${testData.length}, got ${afterCount}`);
      }
      
      // Test 5: Check data structure
      addTestResult('5️⃣ Checking data structure...');
      const storeData = useOrderStore.getState().clientOrders;
      if (storeData.length > 0) {
        const firstOrder = storeData[0];
        addTestResult(`📊 First order structure: orderId=${firstOrder.orderId}, level=${firstOrder.level}`);
        addTestResult(`📊 Has algoOrders: ${Array.isArray(firstOrder.algoOrders)} (${firstOrder.algoOrders?.length || 0} items)`);
        
        if (firstOrder.algoOrders && firstOrder.algoOrders.length > 0) {
          const firstAlgo = firstOrder.algoOrders[0];
          addTestResult(`📊 First algo: orderId=${firstAlgo.orderId}, level=${firstAlgo.level}`);
        }
      }
      
      addTestResult('🎉 Test completed!');
      
    } catch (error) {
      addTestResult(`❌ Test failed with error: ${error}`);
      console.error('Test error:', error);
    }
  };

  const clearTestData = () => {
    setClientOrders([]);
    addTestResult('🗑️ Cleared test data');
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🧪 Data Loading Test Suite</h2>
      
      <div className="flex gap-3 mb-4">
        <button
          onClick={runComprehensiveTest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Run Full Test
        </button>
        <button
          onClick={clearTestData}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Clear Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Orders in Store</div>
          <div className="text-2xl font-bold text-blue-600">{clientOrders.length}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Loading State</div>
          <div className={`text-2xl font-bold ${isLoading ? 'text-yellow-600' : 'text-green-600'}`}>
            {isLoading ? 'Yes' : 'No'}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Error State</div>
          <div className={`text-2xl font-bold ${error ? 'text-red-600' : 'text-green-600'}`}>
            {error ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <div className="text-red-800 font-semibold">Error Details:</div>
          <div className="text-red-700 text-sm">{error}</div>
        </div>
      )}
      
      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-64 overflow-y-auto">
        <div className="text-white font-bold mb-2">Test Results:</div>
        {testResults.length === 0 ? (
          <div className="text-gray-500">Click 'Run Full Test' to start testing...</div>
        ) : (
          testResults.map((result, index) => (
            <div key={index} className="mb-1">{result}</div>
          ))
        )}
      </div>
      
      {clientOrders.length > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
          <div className="text-blue-800 font-semibold mb-2">Sample Order Data:</div>
          <div className="text-sm text-blue-700">
            <div>ID: {clientOrders[0]?.orderId} | Symbol: {clientOrders[0]?.symbol}</div>
            <div>Side: {clientOrders[0]?.side} | State: {clientOrders[0]?.state}</div>
            <div>Algo Orders: {clientOrders[0]?.algoOrders?.length || 0}</div>
            {clientOrders[0]?.algoOrders?.[0] && (
              <div>First Algo: ID={clientOrders[0].algoOrders[0].orderId}, Algorithm={clientOrders[0].algoOrders[0].algorithm}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}