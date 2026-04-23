'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { safeMockDataGenerator, simulateWebSocketConnection, generateLargeDataset } from '@/utils/mock-data-generator';
import { WebSocketMessage } from '@repo/types';

interface SampleDataLoaderProps {
  className?: string;
}

export function SampleDataLoader({ className = '' }: SampleDataLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setClientOrders, addClientOrder, updateOrder, setLoading, setError } = useOrderStore();

  const handleMessage = (message: WebSocketMessage) => {
    try {
      switch (message.type) {
        case 'snapshot':
          if (Array.isArray(message.data)) {
            setClientOrders(message.data);
            setLoading(false);
          }
          break;
          
        case 'orderCreate':
          if (message.data && message.data.level === 'Client') {
            addClientOrder(message.data);
          }
          break;
          
        case 'orderUpdate':
          if (message.data) {
            const update = message.data;
            updateOrder(update.orderId, update.level, update.changes);
          }
          break;
          
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      setError(`Failed to process message: ${error}`);
    }
  };

  const loadEnhancedSampleData = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load enhanced sample data immediately using safe generator
      const enhancedData = safeMockDataGenerator.generateEnhancedSampleData();
      console.log('Loading enhanced data:', enhancedData.length, 'client orders');
      console.log('Enhanced data structure:', enhancedData[0]); // Debug log
      
      // Ensure data is properly set in store
      setClientOrders(enhancedData);
      
      // Verify data was set
      setTimeout(() => {
        const storeState = useOrderStore.getState();
        console.log('Store state after loading enhanced:', {
          clientOrdersCount: storeState.clientOrders.length,
          filteredOrdersCount: storeState.getFilteredClientOrders().length
        });
      }, 100);
      
      setIsLoading(false);
      
      // Start real-time updates
      simulateWebSocketConnection(handleMessage);
    } catch (error) {
      console.error('Error loading enhanced sample data:', error);
      setError(`Failed to load enhanced data: ${error}`);
      setIsLoading(false);
    }
  };

  const loadLargeDataset = () => {
    setIsLoading(true);
    setError(null);
    
    // Load large dataset for performance testing
    generateLargeDataset(handleMessage);
  };

  const loadBasicSampleData = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load basic sample data using safe generator
      const basicData = safeMockDataGenerator.generateClientOrders(25);
      console.log('Loading basic data:', basicData.length, 'client orders');
      console.log('Sample data structure:', basicData[0]); // Debug log
      
      // Ensure data is properly set in store
      setClientOrders(basicData);
      
      // Verify data was set
      setTimeout(() => {
        const storeState = useOrderStore.getState();
        console.log('Store state after loading:', {
          clientOrdersCount: storeState.clientOrders.length,
          filteredOrdersCount: storeState.getFilteredClientOrders().length
        });
      }, 100);
      
      setIsLoading(false);
      
      // Start real-time updates
      simulateWebSocketConnection(handleMessage);
    } catch (error) {
      console.error('Error loading basic sample data:', error);
      setError(`Failed to load basic data: ${error}`);
      setIsLoading(false);
    }
  };

  const clearAllData = () => {
    setClientOrders([]);
    setError(null);
  };

  return (
    <div className={`bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--trading-text))]">Sample Data Controls</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={loadEnhancedSampleData}
          disabled={isLoading}
          className="px-4 py-2 bg-[hsl(var(--trading-buy))] text-white rounded hover:opacity-80 disabled:opacity-50 transition-opacity text-sm font-medium"
        >
          {isLoading ? 'Loading...' : 'Load Enhanced Data'}
        </button>
        
        <button
          onClick={loadBasicSampleData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-80 disabled:opacity-50 transition-opacity text-sm font-medium"
        >
          {isLoading ? 'Loading...' : 'Load Basic Data'}
        </button>
        
        <button
          onClick={loadLargeDataset}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:opacity-80 disabled:opacity-50 transition-opacity text-sm font-medium"
        >
          {isLoading ? 'Loading...' : 'Load Large Dataset'}
        </button>
        
        <button
          onClick={clearAllData}
          disabled={isLoading}
          className="px-4 py-2 bg-[hsl(var(--trading-sell))] text-white rounded hover:opacity-80 disabled:opacity-50 transition-opacity text-sm font-medium"
        >
          Clear Data
        </button>
      </div>
      
      <div className="mt-4 text-xs text-[hsl(var(--trading-text-secondary))] space-y-1">
        <p><strong>Enhanced Data:</strong> Realistic orders with institutional, hedge fund, retail, market making, and cross-border scenarios</p>
        <p><strong>Basic Data:</strong> 25 random orders for basic testing</p>
        <p><strong>Large Dataset:</strong> 1000 orders for performance and scalability testing</p>
        <p><strong>Clear Data:</strong> Remove all orders from the table</p>
        <p className="text-yellow-500 font-medium">💡 Click "Load Enhanced Data" or "Load Basic Data" to populate the order table</p>
      </div>
    </div>
  );
}