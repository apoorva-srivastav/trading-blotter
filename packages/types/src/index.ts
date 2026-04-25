// WebSocket message types
export interface WebSocketMessage {
  type: 'snapshot' | 'orderCreate' | 'orderUpdate' | 'orderDelete' | 'bulkUpdate';
  data: any;
}

// Order hierarchy types - Three level structure: Client -> Algo -> Market
export type OrderLevel = 'Client' | 'Algo' | 'Market';
export type OrderSide = 'Buy' | 'Sell' | 'Short Sell';
export type OrderType = 'Market' | 'Limit' | 'Stop' | 'Stop Limit';
export type TimeInForce = 'Day' | 'GTC' | 'IOC' | 'FOK';
export type OrderState = 'New' | 'Partially Filled' | 'Filled' | 'Cancelled' | 'Rejected' | 'Pending';

// Base order interface with all required columns from requirements
export interface BaseOrder {
  orderId: number;
  level: OrderLevel;
  clientOrderId?: number;
  parentId?: number;
  rejectReason?: string;
  symbol: string;
  ric?: string;
  exchange?: string;
  product?: string;
  trader?: string;
  clientName?: string;
  clientCode?: string;
  account?: string;
  side: OrderSide;
  type: OrderType;
  tif: TimeInForce;
  state: OrderState;
  quantity: number;
  doneQuantity: number;
  availableQuantity: number;
  donePercent: number;
  orderValue: number;
  doneValue: number;
  price: number;
  averagePrice?: number;
  currency: string;
  created: string;
  updated: string;
  sentTime?: string;
}

// Client Order - Top level in hierarchy
export interface ClientOrder extends BaseOrder {
  level: 'Client';
  algoOrders: AlgoOrder[];
}

// Algo Order - Middle level, child of Client Order
export interface AlgoOrder extends BaseOrder {
  level: 'Algo';
  clientOrderId: number;
  algorithm: 'VWAP' | 'TWAP' | 'Iceberg' | 'POV' | 'Custom';
  marketOrders: MarketOrder[];
}

// Market Order - Bottom level, child of Algo Order
export interface MarketOrder extends BaseOrder {
  level: 'Market';
  parentId: number; // References AlgoOrder.orderId
  venue?: string;
  executionTime?: string;
}

// Union type for all orders
export type Order = ClientOrder | AlgoOrder | MarketOrder;

// Filter and sort configurations
export interface FilterConfig {
  column: keyof BaseOrder;
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'in';
  value: any;
  values?: any[]; // For 'in' and 'between' operators
}

export interface SortConfig {
  column: keyof BaseOrder;
  direction: 'asc' | 'desc';
}

// UI State interfaces
export interface ExpandedRows {
  [orderId: number]: boolean;
}

export interface SelectedOrder {
  orderId: number;
  level: OrderLevel;
}

// Statistics and aggregations
export interface OrderStats {
  totalOrders: number;
  clientOrders: number;
  algoOrders: number;
  marketOrders: number;
  totalValue: number;
  totalDoneValue: number;
  fillRate: number;
  avgOrderSize: number;
}

// Pagination interface for handling large datasets
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

// Virtual scrolling configuration for performance
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number;
}

// Real-time update types
export interface OrderUpdate {
  orderId: number;
  level: OrderLevel;
  changes: Partial<BaseOrder>;
  timestamp: string;
}

// Bulk operations for performance
export interface BulkOrderUpdate {
  updates: OrderUpdate[];
  timestamp: string;
}

// Legacy SimpleOrder interface for backward compatibility
export interface SimpleOrder {
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  orderType: 'market' | 'limit';
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: string;
}