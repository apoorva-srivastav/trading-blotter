// High-frequency trading data processing Web Worker
// Handles heavy sorting, filtering, and data aggregation off the main thread

import { ClientOrder, AlgoOrder, MarketOrder, FilterConfig, SortConfig } from '@repo/types';

interface WorkerMessage {
  type: 'PROCESS_DATA' | 'FILTER_DATA' | 'SORT_DATA' | 'AGGREGATE_DATA';
  payload: any;
  requestId: string;
}

interface WorkerResponse {
  type: string;
  payload: any;
  requestId: string;
  timestamp: number;
}

// Data processing functions
function processOrderData(orders: ClientOrder[]): ClientOrder[] {
  // Heavy data processing logic here
  return orders.map(order => ({
    ...order,
    processed: true,
    processedAt: Date.now()
  }));
}

function filterOrders(orders: ClientOrder[], filters: FilterConfig[]): ClientOrder[] {
  let filtered = [...orders];
  
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
}

function sortOrders(orders: ClientOrder[], sortConfig: SortConfig): ClientOrder[] {
  return [...orders].sort((a, b) => {
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];
    
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;
    
    return sortConfig.direction === 'desc' ? -comparison : comparison;
  });
}

function aggregateData(orders: ClientOrder[]) {
  let totalOrders = 0;
  let totalValue = 0;
  let totalDoneValue = 0;
  let algoCount = 0;
  let marketCount = 0;
  
  orders.forEach(clientOrder => {
    totalOrders++;
    totalValue += clientOrder.orderValue;
    totalDoneValue += clientOrder.doneValue;
    
    clientOrder.algoOrders.forEach(algoOrder => {
      algoCount++;
      totalValue += algoOrder.orderValue;
      totalDoneValue += algoOrder.doneValue;
      
      algoOrder.marketOrders.forEach(marketOrder => {
        marketCount++;
        totalValue += marketOrder.orderValue;
        totalDoneValue += marketOrder.doneValue;
      });
    });
  });
  
  return {
    totalOrders: totalOrders + algoCount + marketCount,
    clientOrders: orders.length,
    algoOrders: algoCount,
    marketOrders: marketCount,
    totalValue,
    totalDoneValue,
    fillRate: totalValue > 0 ? (totalDoneValue / totalValue) * 100 : 0,
    avgOrderSize: totalOrders > 0 ? totalValue / totalOrders : 0
  };
}

// Message handler
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, requestId } = event.data;
  let result: any;
  
  try {
    switch (type) {
      case 'PROCESS_DATA':
        result = processOrderData(payload.orders);
        break;
      case 'FILTER_DATA':
        result = filterOrders(payload.orders, payload.filters);
        break;
      case 'SORT_DATA':
        result = sortOrders(payload.orders, payload.sortConfig);
        break;
      case 'AGGREGATE_DATA':
        result = aggregateData(payload.orders);
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    const response: WorkerResponse = {
      type: `${type}_SUCCESS`,
      payload: result,
      requestId,
      timestamp: Date.now()
    };
    
    self.postMessage(response);
  } catch (error) {
    const errorResponse: WorkerResponse = {
      type: `${type}_ERROR`,
      payload: { error: error instanceof Error ? error.message : 'Unknown error' },
      requestId,
      timestamp: Date.now()
    };
    
    self.postMessage(errorResponse);
  }
});

// Export for TypeScript
export {};
