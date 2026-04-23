export interface Order {
  orderId: number;
  level: 'Client' | 'Algo' | 'Market';
  clientOrderId?: number;
  parentId?: number;
  client: string;
  side: 'Buy' | 'Sell' | 'Short Sell';
  symbol: string;
  ric?: string;
  exchange?: string;
  product?: string;
  trader?: string;
  clientName?: string;
  clientCode?: string;
  account?: string;
  type?: string;
  tif?: string;
  state: 'Pending' | 'Partial' | 'Filled' | 'Cancelled' | 'Rejected';
  quantity: number;
  doneQuantity: number;
  availableQuantity: number;
  donePercent: number;
  orderValue: number;
  doneValue: number;
  price: number;
  averagePrice?: number;
  currency: string;
  created: Date;
  updated: Date;
  sentTime?: Date;
  rejectReason?: string;
  algoType?: string;
}

export interface OrderStats {
  totalOrders: number;
  clientOrders: number;
  algoOrders: number;
  marketOrders: number;
  totalValue: number;
  totalDoneValue: number;
}
