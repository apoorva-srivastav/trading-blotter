'use client';

import React, { useEffect, ReactNode } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { safeMockDataGenerator, simulateWebSocketConnection } from '@/utils/mock-data-generator';
import { WebSocketMessage, ClientOrder, OrderUpdate } from '@repo/types';

interface MockWebSocketProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function MockWebSocketProvider({ children, enabled = true }: MockWebSocketProviderProps) {
  const {
    setClientOrders,
    addClientOrder,
    updateOrder,
    setLoading,
    setError,
    clientOrders
  } = useOrderStore();

  useEffect(() => {
    if (!enabled) return;

    // Only load data if we don't already have orders
    if (clientOrders.length > 0) {
      console.log('Data already loaded, skipping initialization');
      return;
    }

    console.log('Initializing mock data...');
    setLoading(true);
    setError(null);

    const handleMessage = (message: WebSocketMessage) => {
      try {
        console.log('Received WebSocket message:', message.type, message.data);
        switch (message.type) {
          case 'snapshot':
            if (Array.isArray(message.data)) {
              console.log('Setting client orders:', message.data.length, 'orders');
              setClientOrders(message.data as ClientOrder[]);
              setLoading(false);
            }
            break;
            
          case 'orderCreate':
            if (message.data && message.data.level === 'Client') {
              console.log('Adding new client order:', message.data.orderId);
              addClientOrder(message.data as ClientOrder);
            }
            break;
            
          case 'orderUpdate':
            if (message.data) {
              const update = message.data as OrderUpdate;
              console.log('Updating order:', update.orderId, update.level);
              updateOrder(update.orderId, update.level, update.changes);
            }
            break;
            
          default:
            console.warn('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error handling mock WebSocket message:', error);
        setError(`Failed to process mock data: ${error}`);
      }
    };

    // Load initial data immediately for better UX
    try {
      const initialData = safeMockDataGenerator.generateEnhancedSampleData();
      console.log('Loading initial data:', initialData.length, 'orders');
      setClientOrders(initialData);
      setLoading(false);
      
      // Start real-time updates after initial load
      setTimeout(() => {
        simulateWebSocketConnection(handleMessage);
      }, 2000);
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(`Failed to load initial data: ${error}`);
      setLoading(false);
    }

    return () => {
      // Cleanup if needed
      setLoading(false);
    };
  }, [enabled, setClientOrders, addClientOrder, updateOrder, setLoading, setError, clientOrders.length]);

  return (
    <>
      {children}
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs max-w-xs">
          <div>Orders: {clientOrders.length}</div>
          <div>Loading: {useOrderStore.getState().isLoading ? 'Yes' : 'No'}</div>
          {useOrderStore.getState().error && (
            <div className="text-red-400">Error: {useOrderStore.getState().error}</div>
          )}
        </div>
      )}
    </>
  );
}