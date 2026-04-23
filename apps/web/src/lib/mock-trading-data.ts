// Mock trading data for development and testing
import { ClientOrder } from '@repo/types';

// Generate realistic mock trading data
export function generateMockTradingData(count: number = 10): ClientOrder[] {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'INTC', 'NFLX'];
  const sides = ['Buy', 'Sell'] as const;
  const states = ['New', 'Partially Filled', 'Filled', 'Cancelled', 'Rejected'] as const;
  const algorithms = ['VWAP', 'TWAP', 'POV', 'Implementation Shortfall', 'Dark Pool'];
  const clients = ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Citadel', 'Renaissance'];
  const traders = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Robert Wilson'];
  const accounts = ['ACC-001', 'ACC-002', 'ACC-003', 'ACC-004', 'ACC-005'];

  const orders: ClientOrder[] = [];
  let orderId = 1000;

  for (let i = 0; i < count; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const quantity = Math.floor(Math.random() * 10000) + 1000;
    const price = Math.random() * 500 + 50;
    const doneQuantity = Math.floor(Math.random() * quantity);
    const donePercent = (doneQuantity / quantity) * 100;
    const state = states[Math.floor(Math.random() * states.length)];
    const clientName = clients[Math.floor(Math.random() * clients.length)];
    const trader = traders[Math.floor(Math.random() * traders.length)];
    const account = accounts[Math.floor(Math.random() * accounts.length)];

    const clientOrderId = orderId++;
    const algoOrderCount = Math.floor(Math.random() * 3) + 1;
    const algoOrders = [];

    for (let j = 0; j < algoOrderCount; j++) {
      const algoOrderId = orderId++;
      const algoQuantity = Math.floor(quantity / algoOrderCount);
      const algoDoneQuantity = Math.floor(Math.random() * algoQuantity);
      const algoDonePercent = (algoDoneQuantity / algoQuantity) * 100;
      const algorithm = algorithms[Math.floor(Math.random() * algorithms.length)];

      const marketOrderCount = Math.floor(Math.random() * 5) + 2;
      const marketOrders = [];

      for (let k = 0; k < marketOrderCount; k++) {
        const marketOrderId = orderId++;
        const marketQuantity = Math.floor(algoQuantity / marketOrderCount);
        const marketDoneQuantity = Math.floor(Math.random() * marketQuantity);
        const marketDonePercent = (marketDoneQuantity / marketQuantity) * 100;
        const marketPrice = price + (Math.random() - 0.5) * 5;
        const marketAvgPrice = marketDoneQuantity > 0 ? marketPrice + (Math.random() - 0.5) * 2 : undefined;

        marketOrders.push({
          orderId: marketOrderId,
          symbol,
          side,
          quantity: marketQuantity,
          doneQuantity: marketDoneQuantity,
          donePercent: marketDonePercent,
          price: marketPrice,
          averagePrice: marketAvgPrice,
          state: marketDonePercent === 100 ? 'Filled' : marketDonePercent > 0 ? 'Partially Filled' : 'New',
          updated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          orderValue: marketQuantity * marketPrice,
          doneValue: marketDoneQuantity * (marketAvgPrice || marketPrice)
        });
      }

      const algoAvgPrice = algoDoneQuantity > 0 ? price + (Math.random() - 0.5) * 3 : undefined;

      algoOrders.push({
        orderId: algoOrderId,
        symbol,
        side,
        quantity: algoQuantity,
        doneQuantity: algoDoneQuantity,
        donePercent: algoDonePercent,
        price,
        averagePrice: algoAvgPrice,
        state: algoDonePercent === 100 ? 'Filled' : algoDonePercent > 0 ? 'Partially Filled' : 'New',
        updated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        algorithm,
        orderValue: algoQuantity * price,
        doneValue: algoDoneQuantity * (algoAvgPrice || price),
        marketOrders
      });
    }

    const averagePrice = doneQuantity > 0 ? price + (Math.random() - 0.5) * 4 : undefined;

    orders.push({
      orderId: clientOrderId,
      symbol,
      side,
      quantity,
      doneQuantity,
      donePercent,
      price,
      averagePrice,
      state,
      updated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      clientName,
      trader,
      account,
      orderValue: quantity * price,
      doneValue: doneQuantity * (averagePrice || price),
      algoOrders
    });
  }

  return orders;
}

// Export a default set of mock data
export const mockTradingData = generateMockTradingData(15);
