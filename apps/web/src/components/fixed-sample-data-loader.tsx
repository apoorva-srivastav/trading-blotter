'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { safeMockDataGenerator } from '@/utils/mock-data-generator';

export function FixedSampleDataLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const { setClientOrders, clientOrders, setError } = useOrderStore();

  const loadBasicData = async () => {
    setIsLoading(true);
    setLastAction('Loading basic data...');
    setError(null);
    
    try {
      // Generate data using safe mock data generator
      const basicData = safeMockDataGenerator.generateClientOrders(10);
      console.log('Generated basic data:', basicData);
      
      // Check if setClientOrders is a function
      if (typeof setClientOrders !== 'function') {
        throw new Error('setClientOrders is not a function');
      }
      
      // Set data in store
      setClientOrders(basicData);
      
      setLastAction(`✅ Loaded ${basicData.length} basic orders`);
      
      // Verify data was set
      setTimeout(() => {
        try {
          const currentOrders = useOrderStore.getState().clientOrders;
          console.log('Store verification:', currentOrders.length, 'orders');
          if (currentOrders.length === 0) {
            setLastAction('❌ Data not persisted in store');
          }
        } catch (storeError) {
          console.error('Store verification error:', storeError);
          setLastAction(`❌ Store verification failed: ${storeError}`);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error loading basic data:', error);
      setError(`Failed to load basic data: ${error}`);
      setLastAction(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnhancedData = async () => {
    setIsLoading(true);
    setLastAction('Loading enhanced data...');
    setError(null);
    
    try {
      // Generate enhanced data using safe mock data generator
      const enhancedData = safeMockDataGenerator.generateEnhancedSampleData();
      console.log('Generated enhanced data:', enhancedData);
      
      // Check if setClientOrders is a function
      if (typeof setClientOrders !== 'function') {
        throw new Error('setClientOrders is not a function');
      }
      
      setClientOrders(enhancedData);
      setLastAction(`✅ Loaded ${enhancedData.length} enhanced orders`);
      
    } catch (error) {
      console.error('Error loading enhanced data:', error);
      setError(`Failed to load enhanced data: ${error}`);
      setLastAction(`❌ Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    try {
      if (typeof setClientOrders !== 'function') {
        throw new Error('setClientOrders is not a function');
      }
      setClientOrders([]);
      setLastAction('🗑️ Cleared all data');
    } catch (error) {
      console.error('Error clearing data:', error);
      setLastAction(`❌ Clear error: ${error}`);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">🔧 Fixed Data Loader</h3>
      
      <div className="flex gap-3 mb-4">
        <button
          onClick={loadBasicData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {isLoading ? 'Loading...' : 'Load Basic (10 orders)'}
        </button>
        
        <button
          onClick={loadEnhancedData}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
        >
          {isLoading ? 'Loading...' : 'Load Enhanced Data'}
        </button>
        
        <button
          onClick={clearData}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
        >
          Clear Data
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Orders in Store:</span>
          <span className="font-bold">{clientOrders.length}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Last Action:</span>
          <span className="font-mono text-xs">{lastAction || 'None'}</span>
        </div>
        
        <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
          💡 This loader directly calls the store methods without WebSocket simulation.
          Use this to test if the basic data flow works.
        </div>
      </div>
    </div>
  );
}