'use client';

import React, { useEffect, useState } from 'react';
import { useOrderStore } from '@/stores/order-store';

export function DataLoadingDiagnostics() {
  const store = useOrderStore();
  const [storeSnapshot, setStoreSnapshot] = useState<any>({});
  const [subscriptionTest, setSubscriptionTest] = useState<string[]>([]);

  const addSubscriptionLog = (message: string) => {
    setSubscriptionTest(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Monitor store changes
  useEffect(() => {
    addSubscriptionLog('🔄 Setting up store subscription...');
    
    const unsubscribe = useOrderStore.subscribe(
      (state) => state.clientOrders,
      (clientOrders) => {
        addSubscriptionLog(`📊 Store changed: ${clientOrders.length} orders`);
        setStoreSnapshot({
          orderCount: clientOrders.length,
          firstOrderId: clientOrders[0]?.orderId || 'none',
          timestamp: new Date().toISOString()
        });
      }
    );
    
    return () => {
      addSubscriptionLog('🔌 Unsubscribing from store...');
      unsubscribe();
    };
  }, []);

  const testStoreReactivity = () => {
    addSubscriptionLog('🧪 Testing store reactivity...');
    
    // Test direct store access
    const currentState = useOrderStore.getState();
    addSubscriptionLog(`📊 Direct access: ${currentState.clientOrders.length} orders`);
    
    // Test store update
    const testOrder = {
      orderId: Date.now(),
      level: 'Client' as const,
      symbol: 'TEST',
      side: 'Buy' as const,
      type: 'Limit' as const,
      tif: 'Day' as const,
      state: 'New' as const,
      quantity: 100,
      doneQuantity: 0,
      availableQuantity: 100,
      donePercent: 0,
      orderValue: 1000,
      doneValue: 0,
      price: 10,
      currency: 'USD',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      clientName: 'Test Client',
      clientCode: 'TEST001',
      trader: 'Test Trader',
      account: 'TEST_ACC',
      exchange: 'TEST',
      product: 'Equity',
      algoOrders: []
    };
    
    currentState.addClientOrder(testOrder);
    addSubscriptionLog('✅ Added test order via store');
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🔍 Store Reactivity Diagnostics</h2>
      
      <button
        onClick={testStoreReactivity}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors mb-4"
      >
        Test Store Reactivity
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Current Orders (Hook)</div>
          <div className="text-2xl font-bold text-blue-600">{store.clientOrders.length}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Last Snapshot</div>
          <div className="text-lg font-bold text-green-600">{storeSnapshot.orderCount || 0}</div>
          <div className="text-xs text-gray-500">{storeSnapshot.firstOrderId}</div>
        </div>
      </div>
      
      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm max-h-32 overflow-y-auto">
        <div className="text-white font-bold mb-2">Subscription Log:</div>
        {subscriptionTest.map((log, index) => (
          <div key={index} className="text-xs">{log}</div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <div><strong>Store Functions Available:</strong></div>
        <div>setClientOrders: {typeof store.setClientOrders === 'function' ? '✅' : '❌'}</div>
        <div>addClientOrder: {typeof store.addClientOrder === 'function' ? '✅' : '❌'}</div>
        <div>getFilteredClientOrders: {typeof store.getFilteredClientOrders === 'function' ? '✅' : '❌'}</div>
      </div>
    </div>
  );
}