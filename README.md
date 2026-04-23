# High-Frequency Trading Platform

## Overview

This is a high-performance, real-time trading platform designed for institutional trading operations. The application provides a comprehensive order management system with a three-level hierarchical structure: **Client Orders → Algo Orders → Market Orders**. Built with modern web technologies and optimized for handling thousands of concurrent orders with sub-50ms latency.

## What It Does

### Core Functionality

#### 📊 **Hierarchical Order Management**
- **Client Orders**: Top-level orders from institutional clients
- **Algo Orders**: Algorithm-driven child orders (VWAP, TWAP, Iceberg, POV, Custom)
- **Market Orders**: Granular execution orders sent to various venues

#### 🔄 **Real-Time Trading Blotter**
- Live order updates via WebSocket connections
- Interactive hierarchical table with expandable rows
- Linked table showing market orders for selected client/algo orders
- Advanced filtering, sorting, and search capabilities

#### 📈 **Performance Analytics**
- Real-time order statistics and fill rates
- Performance monitoring with sub-millisecond tracking
- Order value calculations and P&L tracking
- Execution venue analysis

#### 🎛️ **Advanced UI Features**
- Virtual scrolling for handling 10,000+ orders
- Checkbox selection with stable row identity
- Export functionality (CSV)
- Responsive design with Tailwind CSS
- Dark/light theme support

## Architecture

### System Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • AG Grid       │    │ • WebSocket     │    │ • Order Tables  │
│ • Zustand       │    │ • REST API      │    │ • Indexes       │
│ • TailwindCSS   │    │ • Real-time     │    │ • Constraints   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
              WebSocket Connection
              (Real-time Updates)
```

### Monorepo Structure

```
trading-platform/
├── apps/
│   ├── web/                    # Next.js Frontend Application
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   ├── components/     # React Components
│   │   │   │   └── trading-blotter/  # Core Trading Components
│   │   │   ├── stores/         # Zustand State Management
│   │   │   ├── hooks/          # Custom React Hooks
│   │   │   ├── services/       # WebSocket & API Services
│   │   │   └── utils/          # Utility Functions
│   │   └── package.json
│   └── api/                    # NestJS Backend Application
│       ├── src/
│       │   ├── orders/         # Order Management Module
│       │   ├── websocket/      # WebSocket Gateway
│       │   └── database/       # Database Services
│       └── package.json
├── packages/
│   ├── types/                  # Shared TypeScript Types
│   ├── config/                 # Shared Configurations
│   └── utils/                  # Shared Utilities
└── turbo.json                  # Turborepo Configuration
```

## Technology Stack

### Frontend Technologies

#### **Next.js 14+** - React Framework
- **App Router**: Modern routing with layouts and streaming
- **Server Components**: Reduced client-side JavaScript
- **Built-in Optimization**: Image, font, and script optimization
- **Edge Runtime**: Deploy to edge for lower latency

#### **AG Grid Community/Enterprise** - Data Grid
```json
"ag-grid-community": "^35.2.1",
"ag-grid-enterprise": "^35.2.1",
"ag-grid-react": "^35.2.1"
```
- **Virtual Scrolling**: Handle 10,000+ rows efficiently
- **Advanced Filtering**: Column filters and search
- **Row Selection**: Checkbox selection with stable identity
- **Export Functionality**: CSV export capabilities
- **Custom Cell Renderers**: Order type badges and formatting

#### **Zustand** - State Management
```json
"zustand": "^4.5.0"
```
- **Normalized Data Structure**: O(1) lookups for performance
- **Immutable Updates**: Using Immer for safe state mutations
- **Real-time Subscriptions**: WebSocket integration
- **Optimistic Updates**: Immediate UI feedback

#### **TailwindCSS** - Styling Framework
```json
"tailwindcss": "^3.4.1"
```
- **Utility-First**: Rapid UI development
- **Responsive Design**: Mobile-first approach
- **Component Variants**: Consistent design system
- **Dark Mode**: Built-in theme switching

#### **React Query (TanStack Query)** - Data Fetching
```json
"@tanstack/react-query": "^5.17.19"
```
- **Caching**: Intelligent data caching strategies
- **Background Updates**: Keep data fresh automatically
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Robust error management

### Backend Technologies

#### **NestJS** - Node.js Framework
```json
"@nestjs/core": "^10.3.0",
"@nestjs/websockets": "^10.3.0"
```
- **TypeScript First**: Native TypeScript support
- **Modular Architecture**: Scalable application structure
- **Dependency Injection**: Testable and maintainable code
- **WebSocket Gateway**: Real-time communication
- **Guards & Interceptors**: Security and logging

#### **PostgreSQL** - Database
```json
"pg": "^8.11.3"
```
- **ACID Compliance**: Data integrity for financial operations
- **Advanced Indexing**: Optimized query performance
- **JSON Support**: Flexible data structures
- **Connection Pooling**: Efficient resource management

#### **Socket.IO** - WebSocket Communication
```json
"socket.io": "^4.6.1",
"socket.io-client": "^4.6.1"
```
- **Real-time Updates**: Sub-50ms latency
- **Automatic Reconnection**: Robust connection handling
- **Binary Protocol**: Minimal overhead
- **Room Management**: Targeted updates

### Development & Build Tools

#### **Turborepo** - Monorepo Build System
```json
"turbo": "^1.12.4"
```
- **Incremental Builds**: Only rebuild what changed
- **Remote Caching**: Share build artifacts across team
- **Parallel Execution**: Run tasks simultaneously
- **Pipeline Optimization**: Intelligent task scheduling

#### **TypeScript** - Type Safety
```json
"typescript": "^5.3.3"
```
- **Strict Type Checking**: Catch errors at compile time
- **Shared Types**: Consistent interfaces across frontend/backend
- **IntelliSense**: Enhanced developer experience
- **Refactoring Safety**: Confident code changes

## Performance Optimizations

### Frontend Performance

#### **Virtual Scrolling**
- Renders only visible rows for 10,000+ order performance
- Smooth scrolling with minimal memory footprint
- Dynamic row height support

#### **Memoization Strategy**
```typescript
// Column definitions memoized to prevent grid resets
const columnDefs = useMemo(() => [...], [dependencies]);

// Row ID function for stable selection
const getRowId = useCallback((params) => 
  `${params.data.orderType}-${params.data.orderId}`, []);
```

#### **State Normalization**
```typescript
interface NormalizedOrderData {
  clientOrders: Record<number, ClientOrder>;
  algoOrders: Record<number, AlgoOrder>;
  marketOrders: Record<number, MarketOrder>;
  clientOrderIds: number[];
  algoOrdersByClient: Record<number, number[]>;
  marketOrdersByAlgo: Record<number, number[]>;
}
```

### Backend Performance

#### **Database Optimization**
- Indexed queries for O(log n) lookups
- Connection pooling for efficient resource usage
- Prepared statements for SQL injection prevention

#### **WebSocket Optimization**
- Throttled updates to prevent UI thrashing
- Binary protocol for minimal latency
- Selective updates (only changed data)

## Real-Time Features

### WebSocket Architecture

```typescript
// Real-time order updates
interface WebSocketMessage {
  type: 'snapshot' | 'orderCreate' | 'orderUpdate' | 'orderDelete' | 'bulkUpdate';
  data: any;
}

// Throttled updates for performance
interface ThrottledUpdate {
  orderId: number;
  changes: Partial<BaseOrder>;
  timestamp: number;
}
```

### Update Strategies

1. **Snapshot**: Initial data load
2. **Incremental Updates**: Real-time changes
3. **Bulk Updates**: Batch operations for efficiency
4. **Optimistic Updates**: Immediate UI feedback

## Data Models

### Order Hierarchy

```typescript
// Three-level hierarchy
export interface ClientOrder extends BaseOrder {
  level: 'Client';
  algoOrders: AlgoOrder[];  // 1-3 algo orders typically
}

export interface AlgoOrder extends BaseOrder {
  level: 'Algo';
  clientOrderId: number;
  algorithm: 'VWAP' | 'TWAP' | 'Iceberg' | 'POV' | 'Custom';
  marketOrders: MarketOrder[];  // Hundreds of market orders
}

export interface MarketOrder extends BaseOrder {
  level: 'Market';
  parentId: number;  // References AlgoOrder.orderId
  venue?: string;
  executionTime?: string;
}
```

### Base Order Fields

```typescript
export interface BaseOrder {
  orderId: number;
  symbol: string;
  side: OrderSide;  // 'Buy' | 'Sell' | 'Short Sell'
  type: OrderType;  // 'Market' | 'Limit' | 'Stop' | 'Stop Limit'
  state: OrderState; // 'New' | 'Partially Filled' | 'Filled' | etc.
  quantity: number;
  doneQuantity: number;
  orderValue: number;
  price: number;
  trader?: string;
  created: string;
  updated: string;
  // ... additional fields
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd trading-platform

# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Set up database
psql -U postgres -f apps/api/database/schema.sql
psql -U postgres -f apps/api/database/seed.sql
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run specific app
npm run dev --filter=web    # Frontend only
npm run dev --filter=api    # Backend only
```

### Build & Deploy

```bash
# Build all apps
npm run build

# Build specific app
npm run build --filter=web

# Production start
npm run start
```

## Performance Benchmarks

- **Initial Load**: < 1.5s (Largest Contentful Paint)
- **Time to Interactive**: < 2s
- **WebSocket Latency**: < 50ms
- **API Response Time**: < 100ms (95th percentile)
- **Concurrent Orders**: 10,000+ without performance degradation
- **Memory Usage**: < 200MB for 10,000 orders
- **Bundle Size**: < 500KB (gzipped)

## Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: API protection
- **Input Validation**: Class-validator for DTOs
- **CORS Configuration**: Cross-origin request handling
- **Environment Variables**: Secure configuration management

## Monitoring & Observability

- **Performance Monitor**: Real-time performance tracking
- **Error Boundaries**: Graceful error handling
- **WebSocket Connection Status**: Connection health monitoring
- **Update Counters**: Real-time update frequency tracking

## License

MIT License - see LICENSE file for details

---

*Built with ❤️ for high-frequency trading operations*