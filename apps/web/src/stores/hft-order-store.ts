// High-Frequency Trading optimized order store
// Implements normalized data structure, immutable updates with Immer, and performance optimizations

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import {
  ClientOrder,
  AlgoOrder,
  MarketOrder,
  OrderLevel,
  FilterConfig,
  SortConfig,
  OrderStats,
  PaginationConfig,
  ExpandedRows,
  SelectedOrder,
  BaseOrder
} from '@repo/types';
import WebSocketManager, { ThrottledUpdate } from '@/services/websocket-manager';

// Normalized data structure for O(1) lookups
interface NormalizedOrderData {
  clientOrders: Record<number, ClientOrder>;
  algoOrders: Record<number, AlgoOrder>;
  marketOrders: Record<number, MarketOrder>;
  clientOrderIds: number[];
  algoOrdersByClient: Record<number, number[]>;
  marketOrdersByAlgo: Record<number, number[]>;
}

interface HFTOrderStore {
  // Normalized data structure
  normalizedData: NormalizedOrderData;
  
  // Real-time connection
  wsManager: WebSocketManager | null;
  connectionState: string;
  lastUpdateTime: number;
  updateCount: number;
  
  // UI state
  selectedOrder: SelectedOrder | null;
  expandedRows: ExpandedRows;
  filters: FilterConfig[];
  sortConfig: SortConfig | null;
  searchTerm: string;
  pagination: PaginationConfig;
  isLoading: boolean;
  error: string | null;
  
  // Performance tracking
  renderCount: number;
  lastRenderTime: number;
  
  // Actions
  initializeWebSocket: (url: string) => Promise<void>;
  disconnectWebSocket: () => void;
  
  // Data management with immutable updates
  setClientOrders: (orders: ClientOrder[]) => void;
  addClientOrder: (order: ClientOrder) => void;
  updateOrder: (orderId: number, level: OrderLevel, changes: Partial<BaseOrder>) => void;
  deleteOrder: (orderId: number, level: OrderLevel) => void;
  
  // Batch operations for performance
  batchUpdateOrders: (updates: Array<{ orderId: number; level: OrderLevel; changes: Partial<BaseOrder> }>) => void;
  
  // Selection and expansion
  setSelectedOrder: (order: SelectedOrder | null) => void;
  toggleRowExpansion: (orderId: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  // Filtering and sorting (offloaded to Web Worker)
  addFilter: (filter: FilterConfig) => void;
  removeFilter: (column: keyof BaseOrder) => void;
  clearFilters: () => void;
  setSortConfig: (config: SortConfig | null) => void;
  setSearchTerm: (term: string) => void;
  
  // Pagination
  setPagination: (config: Partial<PaginationConfig>) => void;
  
  // Computed getters with memoization
  getFilteredClientOrders: () => ClientOrder[];
  getAlgoOrdersForClient: (clientOrderId: number) => AlgoOrder[];
  getMarketOrdersForAlgo: (algoOrderId: number) => MarketOrder[];
  getOrderStats: () => OrderStats;
  
  // Performance utilities
  trackRender: () => void;
  getPerformanceMetrics: () => {
    renderCount: number;
    lastRenderTime: number;
    updateCount: number;
    avgUpdateInterval: number;
  };
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Helper functions for normalized data operations
const normalizeOrders = (orders: ClientOrder[]): NormalizedOrderData => {
  const normalizedData: NormalizedOrderData = {
    clientOrders: {},
    algoOrders: {},
    marketOrders: {},
    clientOrderIds: [],
    algoOrdersByClient: {},
    marketOrdersByAlgo: {}
  };
  
  orders.forEach(clientOrder => {
    // Store client order
    normalizedData.clientOrders[clientOrder.orderId] = clientOrder;
    normalizedData.clientOrderIds.push(clientOrder.orderId);
    normalizedData.algoOrdersByClient[clientOrder.orderId] = [];
    
    // Store algo orders
    clientOrder.algoOrders.forEach(algoOrder => {
      normalizedData.algoOrders[algoOrder.orderId] = algoOrder;
      normalizedData.algoOrdersByClient[clientOrder.orderId].push(algoOrder.orderId);
      normalizedData.marketOrdersByAlgo[algoOrder.orderId] = [];
      
      // Store market orders
      algoOrder.marketOrders.forEach(marketOrder => {
        normalizedData.marketOrders[marketOrder.orderId] = marketOrder;
        normalizedData.marketOrdersByAlgo[algoOrder.orderId].push(marketOrder.orderId);
      });
    });
  });
  
  return normalizedData;
};

const denormalizeOrders = (normalizedData: NormalizedOrderData): ClientOrder[] => {
  return normalizedData.clientOrderIds.map(clientOrderId => {
    const clientOrder = normalizedData.clientOrders[clientOrderId];
    const algoOrderIds = normalizedData.algoOrdersByClient[clientOrderId] || [];
    
    const algoOrders = algoOrderIds.map(algoOrderId => {
      const algoOrder = normalizedData.algoOrders[algoOrderId];
      const marketOrderIds = normalizedData.marketOrdersByAlgo[algoOrderId] || [];
      
      const marketOrders = marketOrderIds.map(marketOrderId => 
        normalizedData.marketOrders[marketOrderId]
      );
      
      return {
        ...algoOrder,
        marketOrders
      };
    });
    
    return {
      ...clientOrder,
      algoOrders
    };
  });
};

// Web Worker for heavy operations
let dataWorker: Worker | null = null;

const initializeWorker = () => {
  if (typeof window !== 'undefined' && !dataWorker) {
    try {
      dataWorker = new Worker(new URL('../workers/web-worker.ts', import.meta.url));
    } catch (error) {
      console.warn('Web Worker not available:', error);
    }
  }
};

export const useHFTOrderStore = create<HFTOrderStore>()(subscribeWithSelector((set, get) => {
  // Initialize Web Worker
  initializeWorker();
  
  return {
    // Initial state
    normalizedData: {
      clientOrders: {},
      algoOrders: {},
      marketOrders: {},
      clientOrderIds: [],
      algoOrdersByClient: {},
      marketOrdersByAlgo: {}
    },
    wsManager: null,
    connectionState: 'DISCONNECTED',
    lastUpdateTime: 0,
    updateCount: 0,
    selectedOrder: null,
    expandedRows: {},
    filters: [],
    sortConfig: null,
    searchTerm: '',
    pagination: { page: 1, pageSize: 100, total: 0 },
    isLoading: false,
    error: null,
    renderCount: 0,
    lastRenderTime: 0,
    
    // WebSocket management
    initializeWebSocket: async (url: string) => {
      const wsManager = new WebSocketManager(url);
      
      try {
        await wsManager.connect(
          (update: ThrottledUpdate) => {
            // Handle real-time updates
            set(produce((state: HFTOrderStore) => {
              if (update.orders.length > 0) {
                state.normalizedData = normalizeOrders(update.orders);
                state.lastUpdateTime = update.timestamp;
                state.updateCount++;
              }
            }));
          },
          (error: Error) => {
            set({ error: error.message });
          }
        );
        
        set({ 
          wsManager,
          connectionState: wsManager.getConnectionState(),
          error: null
        });
        
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'WebSocket connection failed'
        });
      }
    },
    
    disconnectWebSocket: () => {
      const { wsManager } = get();
      if (wsManager) {
        wsManager.disconnect();
        set({ 
          wsManager: null,
          connectionState: 'DISCONNECTED'
        });
      }
    },
    
    // Data management with Immer for immutable updates
    setClientOrders: (orders) => {
      set(produce((state: HFTOrderStore) => {
        state.normalizedData = normalizeOrders(orders);
        state.pagination.total = orders.length;
        state.lastUpdateTime = Date.now();
        state.updateCount++;
      }));
    },
    
    addClientOrder: (order) => {
      set(produce((state: HFTOrderStore) => {
        state.normalizedData.clientOrders[order.orderId] = order;
        state.normalizedData.clientOrderIds.push(order.orderId);
        state.normalizedData.algoOrdersByClient[order.orderId] = [];
        state.pagination.total++;
        state.lastUpdateTime = Date.now();
        state.updateCount++;
      }));
    },
    
    updateOrder: (orderId, level, changes) => {
      set(produce((state: HFTOrderStore) => {
        const updatedChanges = {
          ...changes,
          updated: new Date().toISOString()
        };
        
        switch (level) {
          case 'Client':
            if (state.normalizedData.clientOrders[orderId]) {
              Object.assign(state.normalizedData.clientOrders[orderId], updatedChanges);
            }
            break;
          case 'Algo':
            if (state.normalizedData.algoOrders[orderId]) {
              Object.assign(state.normalizedData.algoOrders[orderId], updatedChanges);
            }
            break;
          case 'Market':
            if (state.normalizedData.marketOrders[orderId]) {
              Object.assign(state.normalizedData.marketOrders[orderId], updatedChanges);
            }
            break;
        }
        
        state.lastUpdateTime = Date.now();
        state.updateCount++;
      }));
    },
    
    batchUpdateOrders: (updates) => {
      set(produce((state: HFTOrderStore) => {
        const timestamp = new Date().toISOString();
        
        updates.forEach(({ orderId, level, changes }) => {
          const updatedChanges = {
            ...changes,
            updated: timestamp
          };
          
          switch (level) {
            case 'Client':
              if (state.normalizedData.clientOrders[orderId]) {
                Object.assign(state.normalizedData.clientOrders[orderId], updatedChanges);
              }
              break;
            case 'Algo':
              if (state.normalizedData.algoOrders[orderId]) {
                Object.assign(state.normalizedData.algoOrders[orderId], updatedChanges);
              }
              break;
            case 'Market':
              if (state.normalizedData.marketOrders[orderId]) {
                Object.assign(state.normalizedData.marketOrders[orderId], updatedChanges);
              }
              break;
          }
        });
        
        state.lastUpdateTime = Date.now();
        state.updateCount += updates.length;
      }));
    },
    
    deleteOrder: (orderId, level) => {
      set(produce((state: HFTOrderStore) => {
        switch (level) {
          case 'Client':
            delete state.normalizedData.clientOrders[orderId];
            state.normalizedData.clientOrderIds = state.normalizedData.clientOrderIds.filter(id => id !== orderId);
            delete state.normalizedData.algoOrdersByClient[orderId];
            break;
          case 'Algo':
            delete state.normalizedData.algoOrders[orderId];
            delete state.normalizedData.marketOrdersByAlgo[orderId];
            // Remove from client's algo list
            Object.keys(state.normalizedData.algoOrdersByClient).forEach(clientId => {
              const clientIdNum = Number(clientId);
              state.normalizedData.algoOrdersByClient[clientIdNum] = 
                state.normalizedData.algoOrdersByClient[clientIdNum].filter(id => id !== orderId);
            });
            break;
          case 'Market':
            delete state.normalizedData.marketOrders[orderId];
            // Remove from algo's market list
            Object.keys(state.normalizedData.marketOrdersByAlgo).forEach(algoId => {
              const algoIdNum = Number(algoId);
              state.normalizedData.marketOrdersByAlgo[algoIdNum] = 
                state.normalizedData.marketOrdersByAlgo[algoIdNum].filter(id => id !== orderId);
            });
            break;
        }
        
        state.lastUpdateTime = Date.now();
        state.updateCount++;
      }));
    },
    
    // Selection and expansion
    setSelectedOrder: (order) => set({ selectedOrder: order }),
    
    toggleRowExpansion: (orderId) => {
      set(produce((state: HFTOrderStore) => {
        state.expandedRows[orderId] = !state.expandedRows[orderId];
      }));
    },
    
    expandAll: () => {
      set(produce((state: HFTOrderStore) => {
        state.normalizedData.clientOrderIds.forEach(clientOrderId => {
          state.expandedRows[clientOrderId] = true;
          const algoOrderIds = state.normalizedData.algoOrdersByClient[clientOrderId] || [];
          algoOrderIds.forEach(algoOrderId => {
            state.expandedRows[algoOrderId] = true;
          });
        });
      }));
    },
    
    collapseAll: () => set({ expandedRows: {} }),
    
    // Filtering and sorting
    addFilter: (filter) => {
      set(produce((state: HFTOrderStore) => {
        const existingIndex = state.filters.findIndex(f => f.column === filter.column);
        if (existingIndex >= 0) {
          state.filters[existingIndex] = filter;
        } else {
          state.filters.push(filter);
        }
      }));
    },
    
    removeFilter: (column) => {
      set(produce((state: HFTOrderStore) => {
        state.filters = state.filters.filter(f => f.column !== column);
      }));
    },
    
    clearFilters: () => set({ filters: [], searchTerm: '' }),
    
    setSortConfig: (config) => set({ sortConfig: config }),
    
    setSearchTerm: (term) => set({ searchTerm: term }),
    
    // Pagination
    setPagination: (config) => {
      set(produce((state: HFTOrderStore) => {
        Object.assign(state.pagination, config);
      }));
    },
    
    // Computed getters
    getFilteredClientOrders: () => {
      const state = get();
      const orders = denormalizeOrders(state.normalizedData);
      
      // Apply filters and sorting
      // TODO: Offload to Web Worker for better performance
      let filtered = orders;
      
      // Apply search term
      if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        filtered = filtered.filter(order => 
          order.symbol.toLowerCase().includes(term) ||
          order.clientName?.toLowerCase().includes(term) ||
          order.trader?.toLowerCase().includes(term) ||
          order.account?.toLowerCase().includes(term) ||
          order.orderId.toString().includes(term)
        );
      }
      
      // Apply column filters
      state.filters.forEach(filter => {
        filtered = filtered.filter(order => {
          const value = order[filter.column];
          const filterValue = filter.value;
          
          switch (filter.operator) {
            case 'equals':
              return value === filterValue;
            case 'contains':
              return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
            case 'greaterThan':
              return Number(value) > Number(filterValue);
            case 'lessThan':
              return Number(value) < Number(filterValue);
            case 'between':
              return filter.values && Number(value) >= Number(filter.values[0]) && Number(value) <= Number(filter.values[1]);
            case 'in':
              return filter.values && filter.values.includes(value);
            default:
              return true;
          }
        });
      });
      
      // Apply sorting
      if (state.sortConfig) {
        filtered.sort((a, b) => {
          const aValue = a[state.sortConfig!.column];
          const bValue = b[state.sortConfig!.column];
          
          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return 1;
          if (bValue == null) return -1;
          
          let comparison = 0;
          if (aValue < bValue) comparison = -1;
          if (aValue > bValue) comparison = 1;
          
          return state.sortConfig!.direction === 'desc' ? -comparison : comparison;
        });
      }
      
      return filtered;
    },
    
    getAlgoOrdersForClient: (clientOrderId) => {
      const state = get();
      const algoOrderIds = state.normalizedData.algoOrdersByClient[clientOrderId] || [];
      return algoOrderIds.map(id => state.normalizedData.algoOrders[id]).filter(Boolean);
    },
    
    getMarketOrdersForAlgo: (algoOrderId) => {
      const state = get();
      const marketOrderIds = state.normalizedData.marketOrdersByAlgo[algoOrderId] || [];
      return marketOrderIds.map(id => state.normalizedData.marketOrders[id]).filter(Boolean);
    },
    
    getOrderStats: () => {
      const state = get();
      const orders = denormalizeOrders(state.normalizedData);
      
      let totalOrders = 0;
      let algoOrders = 0;
      let marketOrders = 0;
      let totalValue = 0;
      let totalDoneValue = 0;
      
      orders.forEach(clientOrder => {
        totalOrders++;
        totalValue += clientOrder.orderValue;
        totalDoneValue += clientOrder.doneValue;
        
        clientOrder.algoOrders.forEach(algoOrder => {
          algoOrders++;
          totalValue += algoOrder.orderValue;
          totalDoneValue += algoOrder.doneValue;
          
          algoOrder.marketOrders.forEach(marketOrder => {
            marketOrders++;
            totalValue += marketOrder.orderValue;
            totalDoneValue += marketOrder.doneValue;
          });
        });
      });
      
      const fillRate = totalValue > 0 ? (totalDoneValue / totalValue) * 100 : 0;
      const avgOrderSize = totalOrders > 0 ? totalValue / totalOrders : 0;
      
      return {
        totalOrders: totalOrders + algoOrders + marketOrders,
        clientOrders: orders.length,
        algoOrders,
        marketOrders,
        totalValue,
        totalDoneValue,
        fillRate,
        avgOrderSize
      };
    },
    
    // Performance tracking
    trackRender: () => {
      // Use a non-reactive update to avoid triggering re-renders
      // This directly mutates internal state without notifying subscribers
      const state = get();
      state.renderCount++;
      state.lastRenderTime = Date.now();
    },
    
    getPerformanceMetrics: () => {
      const state = get();
      const avgUpdateInterval = state.updateCount > 1 
        ? (Date.now() - state.lastUpdateTime) / state.updateCount 
        : 0;
      
      return {
        renderCount: state.renderCount,
        lastRenderTime: state.lastRenderTime,
        updateCount: state.updateCount,
        avgUpdateInterval
      };
    },
    
    // Utility
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error })
  };
}));

// Subscribe to updates for performance monitoring
useHFTOrderStore.subscribe(
  (state) => state.normalizedData,
  () => {
    // Track data changes for performance monitoring
    const store = useHFTOrderStore.getState();
    console.log('HFT Store Update:', {
      updateCount: store.updateCount,
      lastUpdateTime: store.lastUpdateTime,
      clientOrders: store.normalizedData.clientOrderIds.length
    });
  }
);
