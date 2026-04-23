import { OrderSide, OrderState, OrderType, TimeInForce } from '@repo/types';

// Predefined trading scenarios for realistic sample data
export const tradingScenarios = {
  // High-volume institutional trades
  institutionalTrades: [
    {
      symbol: 'AAPL',
      side: 'Buy' as OrderSide,
      clientName: 'Goldman Sachs Asset Management',
      trader: 'Michael Chen',
      quantity: 500000,
      price: 175.25,
      state: 'Partially Filled' as OrderState,
      algorithm: 'VWAP',
      account: 'INST001',
      clientCode: 'GS001',
      description: 'Large institutional buy order with VWAP execution'
    },
    {
      symbol: 'MSFT',
      side: 'Sell' as OrderSide,
      clientName: 'BlackRock Institutional',
      trader: 'Sarah Johnson',
      quantity: 750000,
      price: 415.80,
      state: 'New' as OrderState,
      algorithm: 'TWAP',
      account: 'INST002',
      clientCode: 'BR001',
      description: 'Pension fund rebalancing - large Microsoft position'
    }
  ],

  // Hedge fund strategies
  hedgeFundTrades: [
    {
      symbol: 'TSLA',
      side: 'Short Sell' as OrderSide,
      clientName: 'Citadel Securities',
      trader: 'David Rodriguez',
      quantity: 100000,
      price: 185.50,
      state: 'Partially Filled' as OrderState,
      algorithm: 'Iceberg',
      account: 'HF001',
      clientCode: 'CIT001',
      description: 'Hedge fund short position with iceberg strategy'
    },
    {
      symbol: 'NVDA',
      side: 'Buy' as OrderSide,
      clientName: 'Renaissance Technologies',
      trader: 'Lisa Wang',
      quantity: 200000,
      price: 875.25,
      state: 'Filled' as OrderState,
      algorithm: 'POV',
      account: 'HF002',
      clientCode: 'REN001',
      description: 'Quantitative strategy - AI chip play'
    }
  ],

  // Retail aggregation
  retailAggregation: [
    {
      symbol: 'SPY',
      side: 'Buy' as OrderSide,
      clientName: 'Charles Schwab Retail',
      trader: 'Emma Davis',
      quantity: 1000000,
      price: 485.75,
      state: 'Partially Filled' as OrderState,
      algorithm: 'Custom',
      account: 'RET001',
      clientCode: 'CS001',
      description: 'Aggregated retail ETF purchases'
    },
    {
      symbol: 'QQQ',
      side: 'Sell' as OrderSide,
      clientName: 'Fidelity Retail',
      trader: 'John Smith',
      quantity: 500000,
      price: 395.20,
      state: 'New' as OrderState,
      algorithm: 'VWAP',
      account: 'RET002',
      clientCode: 'FID001',
      description: 'Tech sector profit taking'
    }
  ],

  // Market making
  marketMaking: [
    {
      symbol: 'AMZN',
      side: 'Buy' as OrderSide,
      clientName: 'Virtu Financial',
      trader: 'Alex Thompson',
      quantity: 50000,
      price: 3285.50,
      state: 'Filled' as OrderState,
      algorithm: 'Custom',
      account: 'MM001',
      clientCode: 'VIR001',
      description: 'Market making - providing liquidity'
    },
    {
      symbol: 'GOOGL',
      side: 'Sell' as OrderSide,
      clientName: 'Jump Trading',
      trader: 'Rachel Kim',
      quantity: 75000,
      price: 2750.25,
      state: 'Cancelled' as OrderState,
      algorithm: 'Custom',
      account: 'MM002',
      clientCode: 'JMP001',
      description: 'Market making - cancelled due to volatility'
    }
  ],

  // Cross-border trades
  crossBorderTrades: [
    {
      symbol: 'ASML',
      side: 'Buy' as OrderSide,
      clientName: 'UBS Global Asset Management',
      trader: 'Hans Mueller',
      quantity: 25000,
      price: 785.50,
      state: 'Partially Filled' as OrderState,
      algorithm: 'TWAP',
      account: 'GLB001',
      clientCode: 'UBS001',
      description: 'European semiconductor exposure'
    },
    {
      symbol: 'TSM',
      side: 'Sell' as OrderSide,
      clientName: 'Nomura Securities',
      trader: 'Yuki Tanaka',
      quantity: 150000,
      price: 105.75,
      state: 'New' as OrderState,
      algorithm: 'POV',
      account: 'GLB002',
      clientCode: 'NOM001',
      description: 'Asian market rebalancing'
    }
  ],

  // Error scenarios
  errorScenarios: [
    {
      symbol: 'META',
      side: 'Buy' as OrderSide,
      clientName: 'Morgan Stanley',
      trader: 'Kevin Park',
      quantity: 100000,
      price: 485.25,
      state: 'Rejected' as OrderState,
      algorithm: 'VWAP',
      account: 'ERR001',
      clientCode: 'MS001',
      description: 'Order rejected - insufficient buying power',
      rejectReason: 'Insufficient buying power'
    },
    {
      symbol: 'NFLX',
      side: 'Sell' as OrderSide,
      clientName: 'Credit Suisse',
      trader: 'Maria Gonzalez',
      quantity: 80000,
      price: 445.80,
      state: 'Cancelled' as OrderState,
      algorithm: 'Iceberg',
      account: 'ERR002',
      clientCode: 'CS002',
      description: 'Order cancelled - market volatility halt'
    }
  ]
};

// Market conditions for realistic pricing
export const marketConditions = {
  volatile: {
    priceVariation: 0.05, // 5% price variation
    fillRate: 0.6, // 60% average fill rate
    description: 'High volatility market conditions'
  },
  stable: {
    priceVariation: 0.01, // 1% price variation
    fillRate: 0.85, // 85% average fill rate
    description: 'Stable market conditions'
  },
  trending: {
    priceVariation: 0.03, // 3% price variation
    fillRate: 0.75, // 75% average fill rate
    description: 'Trending market with momentum'
  }
};

// Time periods for realistic timestamps
export const timePeriods = {
  preMarket: {
    start: '08:00:00',
    end: '09:30:00',
    description: 'Pre-market trading session'
  },
  marketOpen: {
    start: '09:30:00',
    end: '16:00:00',
    description: 'Regular trading hours'
  },
  afterHours: {
    start: '16:00:00',
    end: '20:00:00',
    description: 'After-hours trading session'
  }
};

// Product types and exchanges
export const tradingVenues = {
  exchanges: ['NYSE', 'NASDAQ', 'ARCA', 'BATS', 'IEX', 'EDGX', 'EDGA', 'BYX', 'BZX'],
  darkPools: ['SIGMA-X', 'CROSSFINDER', 'LIQUIDNET', 'INSTINET', 'ITG POSIT'],
  products: ['Equity', 'ETF', 'ADR', 'REIT', 'Preferred'],
  currencies: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SEK']
};

// Order types and time in force options
export const orderParameters = {
  orderTypes: ['Market', 'Limit', 'Stop', 'Stop Limit', 'Market on Close', 'Limit on Close'] as OrderType[],
  timeInForce: ['Day', 'GTC', 'IOC', 'FOK', 'GTD'] as TimeInForce[],
  algorithms: ['VWAP', 'TWAP', 'Iceberg', 'POV', 'Implementation Shortfall', 'Arrival Price', 'Custom']
};
