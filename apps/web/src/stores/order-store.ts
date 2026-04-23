import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
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

interface OrderStore {
  // Core order data
  clientOrders: ClientOrder[];
  selectedOrder: SelectedOrder | null;
  expandedRows: ExpandedRows;
  
  // Filtering and sorting
  filters: FilterConfig[];
  sortConfig: SortConfig | null;
  searchTerm: string;
  
  // Pagination for performance
  pagination: PaginationConfig;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setClientOrders: (orders: ClientOrder[]) => void;
  addClientOrder: (order: ClientOrder) => void;
  updateOrder: (orderId: number, level: OrderLevel, changes: Partial<BaseOrder>) => void;
  deleteOrder: (orderId: number, level: OrderLevel) => void;
  
  // Selection and expansion
  setSelectedOrder: (order: SelectedOrder | null) => void;
  toggleRowExpansion: (orderId: number) => void;
  expandAll: () => void;
  collapseAll: () => void;
  
  // Filtering and sorting
  addFilter: (filter: FilterConfig) => void;
  removeFilter: (column: keyof BaseOrder) => void;
  clearFilters: () => void;
  setSortConfig: (config: SortConfig | null) => void;
  setSearchTerm: (term: string) => void;
  
  // Pagination
  setPagination: (config: Partial<PaginationConfig>) => void;
  
  // Computed getters
  getFilteredClientOrders: () => ClientOrder[];
  getAlgoOrdersForClient: (clientOrderId: number) => AlgoOrder[];
  getMarketOrdersForAlgo: (algoOrderId: number) => MarketOrder[];
  getOrderStats: () => OrderStats;
  
  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const applyFilters = (orders: ClientOrder[], filters: FilterConfig[], searchTerm: string): ClientOrder[] => {
  let filtered = [...orders];
  
  // Apply search term across multiple fields
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(order => 
      order.symbol.toLowerCase().includes(term) ||
      order.clientName?.toLowerCase().includes(term) ||
      order.trader?.toLowerCase().includes(term) ||
      order.account?.toLowerCase().includes(term) ||
      order.orderId.toString().includes(term)
    );
  }
  
  // Apply column filters
  filters.forEach(filter => {
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
  
  return filtered;
};

const applySorting = (orders: ClientOrder[], sortConfig: SortConfig | null): ClientOrder[] => {
  if (!sortConfig) return orders;
  
  return [...orders].sort((a, b) => {
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];
    
    // Handle undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;
    
    return sortConfig.direction === 'desc' ? -comparison : comparison;
  });
};

export const useOrderStore = create<OrderStore>()(subscribeWithSelector((set, get) => ({
  // Initial state
  clientOrders: [],
  selectedOrder: null,
  expandedRows: {},
  filters: [],
  sortConfig: null,
  searchTerm: '',
  pagination: { page: 1, pageSize: 100, total: 0 },
  isLoading: false,
  error: null,
  
  // Core actions
  setClientOrders: (orders) => {
    set({ 
      clientOrders: orders,
      pagination: { ...get().pagination, total: orders.length }
    });
  },
  
  addClientOrder: (order) => {
    set(state => ({
      clientOrders: [...state.clientOrders, order],
      pagination: { ...state.pagination, total: state.clientOrders.length + 1 }
    }));
  },
  
  updateOrder: (orderId, level, changes) => {
    set(state => {
      const updateOrderInArray = (orders: any[]): any[] => {
        return orders.map(order => {
          if (order.orderId === orderId && order.level === level) {
            return { ...order, ...changes, updated: new Date().toISOString() };
          }
          
          // Recursively update nested orders
          if (order.algoOrders) {
            order.algoOrders = updateOrderInArray(order.algoOrders);
          }
          if (order.marketOrders) {
            order.marketOrders = updateOrderInArray(order.marketOrders);
          }
          
          return order;
        });
      };
      
      return { clientOrders: updateOrderInArray(state.clientOrders) };
    });
  },
  
  deleteOrder: (orderId, level) => {
    set(state => {
      const removeOrderFromArray = (orders: any[]): any[] => {
        return orders.filter(order => {
          if (order.orderId === orderId && order.level === level) {
            return false;
          }
          
          // Recursively remove from nested orders
          if (order.algoOrders) {
            order.algoOrders = removeOrderFromArray(order.algoOrders);
          }
          if (order.marketOrders) {
            order.marketOrders = removeOrderFromArray(order.marketOrders);
          }
          
          return true;
        });
      };
      
      const newClientOrders = removeOrderFromArray(state.clientOrders);
      return {
        clientOrders: newClientOrders,
        pagination: { ...state.pagination, total: newClientOrders.length }
      };
    });
  },
  
  // Selection and expansion
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  
  toggleRowExpansion: (orderId) => {
    set(state => ({
      expandedRows: {
        ...state.expandedRows,
        [orderId]: !state.expandedRows[orderId]
      }
    }));
  },
  
  expandAll: () => {
    const { clientOrders } = get();
    const allOrderIds: { [key: number]: boolean } = {};
    
    clientOrders.forEach(clientOrder => {
      allOrderIds[clientOrder.orderId] = true;
      clientOrder.algoOrders.forEach(algoOrder => {
        allOrderIds[algoOrder.orderId] = true;
      });
    });
    
    set({ expandedRows: allOrderIds });
  },
  
  collapseAll: () => set({ expandedRows: {} }),
  
  // Filtering and sorting
  addFilter: (filter) => {
    set(state => {
      const existingIndex = state.filters.findIndex(f => f.column === filter.column);
      const newFilters = [...state.filters];
      
      if (existingIndex >= 0) {
        newFilters[existingIndex] = filter;
      } else {
        newFilters.push(filter);
      }
      
      return { filters: newFilters };
    });
  },
  
  removeFilter: (column) => {
    set(state => ({
      filters: state.filters.filter(f => f.column !== column)
    }));
  },
  
  clearFilters: () => set({ filters: [], searchTerm: '' }),
  
  setSortConfig: (config) => set({ sortConfig: config }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  // Pagination
  setPagination: (config) => {
    set(state => ({
      pagination: { ...state.pagination, ...config }
    }));
  },
  
  // Computed getters
  getFilteredClientOrders: () => {
    const { clientOrders, filters, sortConfig, searchTerm } = get();
    const filtered = applyFilters(clientOrders, filters, searchTerm);
    return applySorting(filtered, sortConfig);
  },
  
  getAlgoOrdersForClient: (clientOrderId) => {
    const { clientOrders } = get();
    const clientOrder = clientOrders.find(order => order.orderId === clientOrderId);
    return clientOrder?.algoOrders || [];
  },
  
  getMarketOrdersForAlgo: (algoOrderId) => {
    const { clientOrders } = get();
    for (const clientOrder of clientOrders) {
      const algoOrder = clientOrder.algoOrders.find(algo => algo.orderId === algoOrderId);
      if (algoOrder) {
        return algoOrder.marketOrders || [];
      }
    }
    return [];
  },
  
  getOrderStats: () => {
    const { clientOrders } = get();
    let totalOrders = 0;
    let algoOrders = 0;
    let marketOrders = 0;
    let totalValue = 0;
    let totalDoneValue = 0;
    
    clientOrders.forEach(clientOrder => {
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
      clientOrders: clientOrders.length,
      algoOrders,
      marketOrders,
      totalValue,
      totalDoneValue,
      fillRate,
      avgOrderSize
    };
  },
  
  // Utility
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
})));

// Subscribe to order updates for real-time calculations
useOrderStore.subscribe(
  (state) => state.clientOrders,
  () => {
    // Trigger recalculation of derived state when orders change
    const store = useOrderStore.getState();
    store.getOrderStats();
  }
);