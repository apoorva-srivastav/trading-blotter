// WebSocket manager for high-frequency trading data streams
// Implements throttling, binary data handling, and push-based updates

import { ClientOrder, AlgoOrder, MarketOrder } from '@repo/types';

interface WSMessage {
  type: 'ORDER_UPDATE' | 'MARKET_DATA' | 'HEARTBEAT' | 'ERROR';
  data: any;
  timestamp: number;
}

interface ThrottledUpdate {
  orders: ClientOrder[];
  marketData: any[];
  timestamp: number;
}

type UpdateCallback = (data: ThrottledUpdate) => void;
type ErrorCallback = (error: Error) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  
  // Throttling mechanism for high-frequency updates
  private updateBuffer: Map<string, any> = new Map();
  private throttleInterval: NodeJS.Timeout | null = null;
  private readonly THROTTLE_INTERVAL = 50; // 50ms = 20fps
  
  // Callbacks
  private onUpdate: UpdateCallback | null = null;
  private onError: ErrorCallback | null = null;
  
  constructor(private url: string) {}
  
  connect(onUpdate: UpdateCallback, onError: ErrorCallback): Promise<void> {
    this.onUpdate = onUpdate;
    this.onError = onError;
    
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        // Use binary data for better performance
        this.ws.binaryType = 'arraybuffer';
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.startThrottling();
          resolve();
        };
        
        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };
        
        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          this.stopThrottling();
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnect();
          }
        };
        
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.onError?.(new Error('WebSocket connection error'));
          reject(error);
        };
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  private handleMessage(event: MessageEvent) {
    try {
      let message: WSMessage;
      
      // Handle both binary and text messages
      if (event.data instanceof ArrayBuffer) {
        // For binary Protocol Buffer messages (future implementation)
        // message = this.deserializeProtobuf(event.data);
        // For now, convert to text
        const decoder = new TextDecoder();
        const jsonString = decoder.decode(event.data);
        message = JSON.parse(jsonString);
      } else {
        // Text JSON message
        message = JSON.parse(event.data);
      }
      
      this.processMessage(message);
      
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      this.onError?.(new Error('Failed to parse WebSocket message'));
    }
  }
  
  private processMessage(message: WSMessage) {
    switch (message.type) {
      case 'ORDER_UPDATE':
        this.bufferUpdate('orders', message.data);
        break;
      case 'MARKET_DATA':
        this.bufferUpdate('marketData', message.data);
        break;
      case 'HEARTBEAT':
        // Handle heartbeat
        break;
      case 'ERROR':
        this.onError?.(new Error(message.data.message || 'Server error'));
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }
  
  private bufferUpdate(type: string, data: any) {
    // Buffer updates to throttle them
    this.updateBuffer.set(type, {
      data,
      timestamp: Date.now()
    });
  }
  
  private startThrottling() {
    this.throttleInterval = setInterval(() => {
      this.flushUpdates();
    }, this.THROTTLE_INTERVAL);
  }
  
  private stopThrottling() {
    if (this.throttleInterval) {
      clearInterval(this.throttleInterval);
      this.throttleInterval = null;
    }
  }
  
  private flushUpdates() {
    if (this.updateBuffer.size === 0) return;
    
    const orders = this.updateBuffer.get('orders')?.data || [];
    const marketData = this.updateBuffer.get('marketData')?.data || [];
    
    const throttledUpdate: ThrottledUpdate = {
      orders,
      marketData,
      timestamp: Date.now()
    };
    
    this.onUpdate?.(throttledUpdate);
    this.updateBuffer.clear();
  }
  
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'HEARTBEAT', timestamp: Date.now() });
      }
    }, 30000); // 30 seconds
  }
  
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  private async reconnect() {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(() => {
      if (this.onUpdate && this.onError) {
        this.connect(this.onUpdate, this.onError).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }
  
  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      // Send as binary for better performance (future Protocol Buffer implementation)
      // const buffer = this.serializeProtobuf(data);
      // this.ws.send(buffer);
      
      // For now, send as JSON
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }
  
  disconnect() {
    this.isConnected = false;
    this.stopHeartbeat();
    this.stopThrottling();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }
  
  getConnectionState(): string {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'CONNECTED';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'DISCONNECTED';
      default: return 'UNKNOWN';
    }
  }
  
  // Future Protocol Buffer implementation
  // private serializeProtobuf(data: any): ArrayBuffer {
  //   // Implementation for Protocol Buffer serialization
  //   return new ArrayBuffer(0);
  // }
  
  // private deserializeProtobuf(buffer: ArrayBuffer): WSMessage {
  //   // Implementation for Protocol Buffer deserialization
  //   return { type: 'HEARTBEAT', data: {}, timestamp: Date.now() };
  // }
}

export default WebSocketManager;
export type { WSMessage, ThrottledUpdate, UpdateCallback, ErrorCallback };
