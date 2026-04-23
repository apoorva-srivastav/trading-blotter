import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useOrderStore } from '@/stores/order-store';
import {
  WebSocketMessage,
  ClientOrder,
  OrderUpdate,
  BulkOrderUpdate
} from '@repo/types';

interface UseWebSocketConfig {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

const DEFAULT_CONFIG: UseWebSocketConfig = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000
};

export function useWebSocket(config: UseWebSocketConfig = {}) {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectedRef = useRef(false);
  
  const {
    setClientOrders,
    addClientOrder,
    updateOrder,
    deleteOrder,
    setLoading,
    setError
  } = useOrderStore();

  const clearTimeouts = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    if (!finalConfig.heartbeatInterval) return;
    
    heartbeatTimeoutRef.current = setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
        startHeartbeat(); // Schedule next heartbeat
      }
    }, finalConfig.heartbeatInterval);
  }, [finalConfig.heartbeatInterval]);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'snapshot':
          // Initial data load
          if (Array.isArray(message.data)) {
            setClientOrders(message.data as ClientOrder[]);
            setLoading(false);
          }
          break;
          
        case 'orderCreate':
          // New order added
          if (message.data && message.data.level === 'Client') {
            addClientOrder(message.data as ClientOrder);
          }
          break;
          
        case 'orderUpdate':
          // Single order update
          if (message.data) {
            const update = message.data as OrderUpdate;
            updateOrder(update.orderId, update.level, update.changes);
          }
          break;
          
        case 'bulkUpdate':
          // Multiple order updates for performance
          if (message.data) {
            const bulkUpdate = message.data as BulkOrderUpdate;
            bulkUpdate.updates.forEach(update => {
              updateOrder(update.orderId, update.level, update.changes);
            });
          }
          break;
          
        case 'orderDelete':
          // Order removal
          if (message.data) {
            const { orderId, level } = message.data;
            deleteOrder(orderId, level);
          }
          break;
          
        default:
          console.warn('Unknown WebSocket message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      setError('Failed to parse real-time update');
    }
  }, [setClientOrders, addClientOrder, updateOrder, deleteOrder, setLoading, setError]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      setLoading(true);
      setError(null);
      
      wsRef.current = new WebSocket(finalConfig.url!);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        isConnectedRef.current = true;
        reconnectAttemptsRef.current = 0;
        setError(null);
        startHeartbeat();
        
        // Request initial data
        wsRef.current?.send(JSON.stringify({ type: 'subscribe', channel: 'orders' }));
      };
      
      wsRef.current.onmessage = handleMessage;
      
      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        isConnectedRef.current = false;
        clearTimeouts();
        
        // Attempt reconnection if not a clean close
        if (event.code !== 1000 && reconnectAttemptsRef.current < finalConfig.maxReconnectAttempts!) {
          reconnectAttemptsRef.current++;
          setError(`Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${finalConfig.maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, finalConfig.reconnectInterval);
        } else if (reconnectAttemptsRef.current >= finalConfig.maxReconnectAttempts!) {
          setError('Failed to reconnect. Please refresh the page.');
          setLoading(false);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error occurred');
      };
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setError('Failed to establish connection');
      setLoading(false);
    }
  }, [finalConfig, handleMessage, setLoading, setError, clearTimeouts, startHeartbeat]);

  const disconnect = useCallback(() => {
    clearTimeouts();
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }
    
    isConnectedRef.current = false;
  }, [clearTimeouts]);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    console.warn('WebSocket not connected. Cannot send message:', message);
    return false;
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Handle page visibility changes to manage connection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, we might want to reduce heartbeat frequency
        clearTimeouts();
      } else {
        // Page is visible again, resume normal operation
        if (isConnectedRef.current) {
          startHeartbeat();
        } else {
          // Reconnect if connection was lost while page was hidden
          connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connect, clearTimeouts, startHeartbeat]);

  return {
    isConnected: isConnectedRef.current,
    sendMessage,
    connect,
    disconnect
  };
}