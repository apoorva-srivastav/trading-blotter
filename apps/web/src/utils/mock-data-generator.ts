import {
  ClientOrder,
  AlgoOrder,
  MarketOrder,
  OrderSide,
  OrderState,
  OrderType,
  TimeInForce,
  WebSocketMessage
} from '@repo/types';
import { tradingScenarios } from './trading-scenarios';

// Mock data generator for testing the trading blotter
class MockDataGenerator {
  private orderIdCounter = 1;
  private symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'];
  private clientNames = ['Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'BlackRock', 'Vanguard', 'Fidelity'];
  private traders = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Wang', 'David Brown', 'Emma Davis'];
  private accounts = ['ACC001', 'ACC002', 'ACC003', 'ACC004', 'ACC005', 'ACC006'];
  private algorithms: ('VWAP' | 'TWAP' | 'Iceberg' | 'POV' | 'Custom')[] = ['VWAP', 'TWAP', 'Iceberg', 'POV', 'Custom'];
  private venues = ['NYSE', 'NASDAQ', 'BATS', 'ARCA', 'IEX', 'EDGX'];
  private currencies = ['USD', 'EUR', 'GBP', 'JPY'];

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomPrice(): number {
    return Math.round((Math.random() * 500 + 10) * 100) / 100;
  }

  private getRandomQuantity(): number {
    return this.getRandomNumber(100, 10000) * 100;
  }

  private generateTimestamp(hoursBack: number = 0): string {
    const now = new Date();
    now.setHours(now.getHours() - hoursBack);
    return now.toISOString();
  }

  private generateMarketOrder(parentId: number, symbol: string, side: OrderSide, basePrice: number): MarketOrder {
    const orderId = this.orderIdCounter++;
    const quantity = this.getRandomNumber(10, 500) * 10;
    const price = basePrice + (Math.random() - 0.5) * 2; // Price variation
    const doneQuantity = Math.floor(quantity * Math.random());
    const orderValue = quantity * price;
    const doneValue = doneQuantity * price;
    const averagePrice = doneQuantity > 0 ? doneValue / doneQuantity : undefined;

    return {
      orderId,
      level: 'Market',
      parentId,
      symbol,
      side,
      type: this.getRandomElement(['Market', 'Limit'] as OrderType[]),
      tif: this.getRandomElement(['Day', 'GTC', 'IOC'] as TimeInForce[]),
      state: this.getRandomElement(['New', 'Partially Filled', 'Filled', 'Cancelled'] as OrderState[]),
      quantity,
      doneQuantity,
      availableQuantity: quantity - doneQuantity,
      donePercent: quantity > 0 ? (doneQuantity / quantity) * 100 : 0,
      orderValue,
      doneValue,
      price,
      averagePrice,
      currency: this.getRandomElement(this.currencies),
      created: this.generateTimestamp(Math.random() * 24),
      updated: this.generateTimestamp(Math.random() * 2),
      venue: this.getRandomElement(this.venues),
      executionTime: doneQuantity > 0 ? this.generateTimestamp(Math.random() * 1) : undefined
    };
  }

  private generateAlgoOrder(clientOrderId: number, symbol: string, side: OrderSide, basePrice: number): AlgoOrder {
    const orderId = this.orderIdCounter++;
    const quantity = this.getRandomNumber(1000, 5000) * 100;
    const price = basePrice;
    
    // Generate 5-50 market orders for this algo order
    const marketOrderCount = this.getRandomNumber(5, 50);
    const marketOrders: MarketOrder[] = [];
    
    let totalDoneQuantity = 0;
    let totalDoneValue = 0;
    
    for (let i = 0; i < marketOrderCount; i++) {
      const marketOrder = this.generateMarketOrder(orderId, symbol, side, price);
      marketOrders.push(marketOrder);
      totalDoneQuantity += marketOrder.doneQuantity;
      totalDoneValue += marketOrder.doneValue;
    }
    
    const orderValue = quantity * price;
    const donePercent = quantity > 0 ? (totalDoneQuantity / quantity) * 100 : 0;
    const averagePrice = totalDoneQuantity > 0 ? totalDoneValue / totalDoneQuantity : undefined;

    return {
      orderId,
      level: 'Algo',
      clientOrderId,
      symbol,
      side,
      type: this.getRandomElement(['Market', 'Limit'] as OrderType[]),
      tif: this.getRandomElement(['Day', 'GTC'] as TimeInForce[]),
      state: donePercent >= 100 ? 'Filled' : donePercent > 0 ? 'Partially Filled' : 'New',
      quantity,
      doneQuantity: Math.min(totalDoneQuantity, quantity),
      availableQuantity: Math.max(0, quantity - totalDoneQuantity),
      donePercent: Math.min(100, donePercent),
      orderValue,
      doneValue: Math.min(totalDoneValue, orderValue),
      price,
      averagePrice,
      currency: this.getRandomElement(this.currencies),
      created: this.generateTimestamp(Math.random() * 24),
      updated: this.generateTimestamp(Math.random() * 2),
      algorithm: this.getRandomElement(this.algorithms),
      marketOrders
    };
  }

  private generateClientOrder(): ClientOrder {
    const orderId = this.orderIdCounter++;
    const symbol = this.getRandomElement(this.symbols);
    const side = this.getRandomElement(['Buy', 'Sell', 'Short Sell'] as OrderSide[]);
    const price = this.getRandomPrice();
    const quantity = this.getRandomQuantity();
    
    // Generate 1-3 algo orders for this client order
    const algoOrderCount = this.getRandomNumber(1, 3);
    const algoOrders: AlgoOrder[] = [];
    
    let totalDoneQuantity = 0;
    let totalDoneValue = 0;
    
    for (let i = 0; i < algoOrderCount; i++) {
      const algoOrder = this.generateAlgoOrder(orderId, symbol, side, price);
      algoOrders.push(algoOrder);
      totalDoneQuantity += algoOrder.doneQuantity;
      totalDoneValue += algoOrder.doneValue;
    }
    
    const orderValue = quantity * price;
    const donePercent = quantity > 0 ? (totalDoneQuantity / quantity) * 100 : 0;
    const averagePrice = totalDoneQuantity > 0 ? totalDoneValue / totalDoneQuantity : undefined;

    return {
      orderId,
      level: 'Client',
      symbol,
      side,
      type: this.getRandomElement(['Market', 'Limit'] as OrderType[]),
      tif: this.getRandomElement(['Day', 'GTC'] as TimeInForce[]),
      state: donePercent >= 100 ? 'Filled' : donePercent > 0 ? 'Partially Filled' : 'New',
      quantity,
      doneQuantity: Math.min(totalDoneQuantity, quantity),
      availableQuantity: Math.max(0, quantity - totalDoneQuantity),
      donePercent: Math.min(100, donePercent),
      orderValue,
      doneValue: Math.min(totalDoneValue, orderValue),
      price,
      averagePrice,
      currency: this.getRandomElement(this.currencies),
      created: this.generateTimestamp(Math.random() * 48),
      updated: this.generateTimestamp(Math.random() * 4),
      clientName: this.getRandomElement(this.clientNames),
      clientCode: `CLI${this.getRandomNumber(100, 999)}`,
      trader: this.getRandomElement(this.traders),
      account: this.getRandomElement(this.accounts),
      exchange: this.getRandomElement(['NYSE', 'NASDAQ', 'LSE', 'TSE']),
      product: 'Equity',
      algoOrders
    };
  }

  public generateClientOrders(count: number): ClientOrder[] {
    const orders: ClientOrder[] = [];
    
    for (let i = 0; i < count; i++) {
      orders.push(this.generateClientOrder());
    }
    
    return orders;
  }

  // Generate more diverse and realistic sample data
  public generateEnhancedSampleData(): ClientOrder[] {
    const enhancedOrders: ClientOrder[] = [];
    
    // Combine all scenario types for realistic data
    const allScenarios = [
      ...tradingScenarios.institutionalTrades,
      ...tradingScenarios.hedgeFundTrades,
      ...tradingScenarios.retailAggregation,
      ...tradingScenarios.marketMaking,
      ...tradingScenarios.crossBorderTrades,
      ...tradingScenarios.errorScenarios
    ];
    
    allScenarios.forEach((scenario, _index) => {
      const orderId = this.orderIdCounter++;
      const price = scenario.price || this.getRandomPrice();
      const { quantity, state } = scenario;
      
      // Calculate done quantities based on state
      let doneQuantity = 0;
      if (state === 'Filled') {
        doneQuantity = quantity;
      } else if (state === 'Partially Filled') {
        doneQuantity = Math.floor(quantity * (0.3 + Math.random() * 0.4)); // 30-70% filled
      } else if (state === 'Rejected' || state === 'Cancelled') {
        doneQuantity = 0;
      }
      
      const orderValue = quantity * price;
      const doneValue = doneQuantity * price;
      const donePercent = quantity > 0 ? (doneQuantity / quantity) * 100 : 0;
      const averagePrice = doneQuantity > 0 ? doneValue / doneQuantity : undefined;
      
      // Generate algo orders with specific algorithms from scenario
      const algoCount = this.getRandomNumber(1, 3);
      const algoOrders: AlgoOrder[] = [];
      
      for (let i = 0; i < algoCount; i++) {
        const algoOrder = this.generateAlgoOrder(orderId, scenario.symbol, scenario.side, price);
        // Use algorithm from scenario or fallback to random
        algoOrder.algorithm = (scenario.algorithm as 'VWAP' | 'TWAP' | 'Iceberg' | 'POV' | 'Custom') || this.algorithms[i % this.algorithms.length];
        algoOrders.push(algoOrder);
      }
      
      const clientOrder: ClientOrder = {
        orderId,
        level: 'Client',
        symbol: scenario.symbol,
        side: scenario.side,
        type: this.getRandomElement(['Market', 'Limit'] as OrderType[]),
        tif: this.getRandomElement(['Day', 'GTC'] as TimeInForce[]),
        state: scenario.state,
        quantity,
        doneQuantity,
        availableQuantity: quantity - doneQuantity,
        donePercent,
        orderValue,
        doneValue,
        price,
        averagePrice,
        currency: 'USD',
        created: this.generateTimestamp(Math.random() * 48),
        updated: this.generateTimestamp(Math.random() * 4),
        clientName: scenario.clientName,
        clientCode: scenario.clientCode,
        trader: scenario.trader,
        account: scenario.account,
        exchange: this.getRandomElement(['NYSE', 'NASDAQ', 'LSE', 'TSE']),
        product: 'Equity',
        rejectReason: (scenario as any).rejectReason,
        algoOrders
      };
      
      enhancedOrders.push(clientOrder);
    });
    
    // Add additional random orders
    const additionalCount = 40;
    for (let i = 0; i < additionalCount; i++) {
      enhancedOrders.push(this.generateClientOrder());
    }
    
    return enhancedOrders;
  }

  public generateRealtimeUpdate(): WebSocketMessage {
    const updateTypes: ('orderUpdate' | 'orderCreate')[] = ['orderUpdate', 'orderCreate'];
    const type = this.getRandomElement(updateTypes);
    
    if (type === 'orderCreate') {
      return {
        type,
        data: this.generateClientOrder()
      };
    } else {
      // Generate a random order update
      return {
        type,
        data: {
          orderId: this.getRandomNumber(1, 100),
          level: this.getRandomElement(['Client', 'Algo', 'Market']),
          changes: {
            doneQuantity: this.getRandomNumber(100, 1000),
            state: this.getRandomElement(['Partially Filled', 'Filled']),
            updated: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

// Create and export the mock data generator instance
let mockDataGeneratorInstance: MockDataGenerator | null = null;

try {
  mockDataGeneratorInstance = new MockDataGenerator();
  console.log('MockDataGenerator instance created successfully');
} catch (error) {
  console.error('Failed to create MockDataGenerator instance:', error);
  // Create a fallback instance to prevent undefined errors
  mockDataGeneratorInstance = null;
}

// Export with null check to prevent runtime errors
export const mockDataGenerator = mockDataGeneratorInstance || {
  generateClientOrders: () => [],
  generateEnhancedSampleData: () => [],
  generateRealtimeUpdate: () => ({ type: 'snapshot', data: [] })
};

// Export a safe version that checks for null and provides fallbacks
export const safeMockDataGenerator = {
  generateClientOrders: (count: number) => {
    if (!mockDataGeneratorInstance || typeof mockDataGeneratorInstance.generateClientOrders !== 'function') {
      console.warn('MockDataGenerator instance is not available, returning empty array');
      return [];
    }
    try {
      return mockDataGeneratorInstance.generateClientOrders(count);
    } catch (error) {
      console.error('Error in generateClientOrders:', error);
      return [];
    }
  },
  generateEnhancedSampleData: () => {
    if (!mockDataGeneratorInstance || typeof mockDataGeneratorInstance.generateEnhancedSampleData !== 'function') {
      console.warn('MockDataGenerator instance is not available, returning empty array');
      return [];
    }
    try {
      return mockDataGeneratorInstance.generateEnhancedSampleData();
    } catch (error) {
      console.error('Error in generateEnhancedSampleData:', error);
      return [];
    }
  },
  generateRealtimeUpdate: () => {
    if (!mockDataGeneratorInstance || typeof mockDataGeneratorInstance.generateRealtimeUpdate !== 'function') {
      console.warn('MockDataGenerator instance is not available, returning empty snapshot');
      return { type: 'snapshot' as const, data: [] };
    }
    try {
      return mockDataGeneratorInstance.generateRealtimeUpdate();
    } catch (error) {
      console.error('Error in generateRealtimeUpdate:', error);
      return { type: 'snapshot' as const, data: [] };
    }
  }
};

// Helper function to simulate WebSocket messages
export function simulateWebSocketConnection(callback: (message: WebSocketMessage) => void) {
  try {
    // Send initial snapshot with enhanced sample data
    setTimeout(() => {
      try {
        callback({
          type: 'snapshot',
          data: safeMockDataGenerator.generateEnhancedSampleData()
        });
      } catch (error) {
        console.error('Error generating snapshot data:', error);
      }
    }, 1000);
    
    // Send periodic updates
    setInterval(() => {
      try {
        if (Math.random() > 0.3) { // 70% chance of update
          callback(safeMockDataGenerator.generateRealtimeUpdate());
        }
      } catch (error) {
        console.error('Error generating realtime update:', error);
      }
    }, 2000);
  } catch (error) {
    console.error('Error setting up WebSocket simulation:', error);
  }
}

// Helper function to generate large dataset for performance testing
export function generateLargeDataset(callback: (message: WebSocketMessage) => void) {
  try {
    // Send initial large dataset
    setTimeout(() => {
      try {
        callback({
          type: 'snapshot',
          data: safeMockDataGenerator.generateClientOrders(1000) // 1000 orders for stress testing
        });
      } catch (error) {
        console.error('Error generating large dataset:', error);
      }
    }, 1000);
    
    // Send frequent updates for real-time testing
    setInterval(() => {
      try {
        if (Math.random() > 0.2) { // 80% chance of update
          callback(safeMockDataGenerator.generateRealtimeUpdate());
        }
      } catch (error) {
        console.error('Error generating frequent update:', error);
      }
    }, 1000);
  } catch (error) {
    console.error('Error setting up large dataset generation:', error);
  }
}