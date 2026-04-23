# High-Frequency Trading (HFT) Platform

A performance-optimized trading interface built with Next.js, React 18, and AG Grid Enterprise, designed for real-time data processing and minimal latency.

## 🚀 HFT Architecture Overview

This application implements all critical HFT requirements:

### 1. High-Level System Architecture

#### Backend (Node.js/TypeScript)
- **Transport Layer**: WebSocket (ws) for full-duplex communication
- **Data Serialization**: Protocol Buffers (Protobuf) support for binary data
- **Throttling Layer**: Aggregated updates with 50-100ms frame buffering

#### Frontend (React/TypeScript)
- **State Management**: Normalized Store with Zustand + Immer for immutable updates
- **Data Processing**: Web Worker for heavy sorting, filtering, and aggregation
- **Performance**: Non-blocking UI thread with optimized rendering

### 2. Frontend Architecture: "Performance First" Strategy

#### Virtualized Rendering
- **AG Grid Enterprise**: Industry-standard for financial blotters
- **Tree Data Support**: Hierarchical Client → Algo → Market orders
- **Delta Updates**: Only updates changed cells, not entire table
- **Virtualization**: Renders only visible rows (~20 at a time)

#### Grid Component Features
- **High-Performance**: AG Grid Enterprise with financial optimizations
- **Hierarchical Logic**: Flattened data structure with O(1) lookups
- **Master-Detail Pattern**: Linked tables for market orders

### 3. Data Flow & Optimization Techniques

#### Push-Based Update Cycle
1. Binary packet arrives via WebSocket
2. Web Worker decodes and merges into local cache
3. Throttled dispatch at 60fps (every 16ms)
4. Memoized React components prevent unnecessary re-renders

#### Column-Level Performance
- **Cell Renderers**: CSS-based price change indicators
- **Atomic Updates**: Batch thousands of updates without UI lock
- **Flash Animations**: Green/red price change indicators

### 4. Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Language | TypeScript | Type safety for complex order states |
| UI Framework | React 18+ | Concurrent Mode for prioritized rendering |
| Data Grid | AG Grid Enterprise | Industry standard for "Big Data" blotters |
| State | Zustand + Immer | Minimal overhead, immutable updates |
| Communication | WebSocket | Real-time bi-directional streaming |
| Processing | Web Workers | Off-main-thread data processing |
| Testing | Playwright | High-load stress testing |

### 5. Critical UI/UX Rules for Traders

- **No Layout Shift**: Fixed column widths, no jumping on data load
- **Keyboard First**: Every action has hotkeys (Cancel: Delete, Modify: F2, etc.)
- **Color as Information**: High-contrast Buy (green) vs Sell (red)
- **Micro-Throttling**: Pause animations during scrolling to save CPU

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AG Grid Enterprise license (for production)

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create `.env.local`:
```env
# HFT Configuration
HFT_MODE=true
WS_URL=ws://localhost:8080/trading
ENABLE_PERFORMANCE_MONITORING=true
MAX_RENDER_TIME_MS=16
MIN_FPS=30
MAX_LATENCY_MS=100

# AG Grid Enterprise License
AG_GRID_LICENSE_KEY=your_license_key_here
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📊 Performance Features

### Real-Time Performance Monitoring
- **FPS Tracking**: Maintains 60fps target
- **Render Time**: Monitors <16ms render cycles
- **Memory Usage**: Tracks JavaScript heap
- **WebSocket Latency**: Real-time connection monitoring
- **Performance Grades**: A+ to C based on metrics

### Keyboard Shortcuts
| Action | Shortcut | Description |
|--------|----------|-------------|
| Cancel Order | Delete | Cancel selected order |
| Modify Order | F2 | Modify selected order |
| Slice Order | F3 | Slice selected order |
| New Order | F9 | Create new order |
| Quick Buy | Ctrl+Shift+B | Quick buy action |
| Quick Sell | Ctrl+Shift+S | Quick sell action |
| Expand All | Ctrl++ | Expand all order hierarchy |
| Collapse All | Ctrl+- | Collapse all orders |
| Clear Filters | Ctrl+R | Reset all filters |
| Emergency Stop | F12 | Stop all orders (with confirmation) |

### Data Processing Optimizations
- **Normalized Store**: O(1) order lookups
- **Immutable Updates**: Immer for efficient state changes
- **Web Worker Processing**: Heavy operations off main thread
- **Delta Updates**: Only process changed data
- **Throttled Rendering**: 60fps update cycle

## 🏗 Architecture Components

### Core Components
- `HFTTradingPlatform`: Main container with real-time stats
- `AGGridTradingTable`: High-performance data grid
- `HFTOrderStore`: Normalized state management
- `WebSocketManager`: Real-time data streaming
- `PerformanceMonitor`: Real-time performance tracking
- `HFTKeyboardShortcuts`: Trader keyboard navigation

### Data Flow
```
WebSocket → Web Worker → Normalized Store → AG Grid → UI
     ↓           ↓            ↓           ↓        ↓
  Binary     Processing   Immutable   Delta   Render
   Data      (50-100ms)   Updates    Updates  (16ms)
```

### File Structure
```
src/
├── components/
│   ├── hft-trading-platform.tsx      # Main HFT container
│   ├── trading-blotter/
│   │   ├── ag-grid-trading-table.tsx  # AG Grid implementation
│   │   └── order-table.tsx            # Legacy table component
│   └── ui/
│       ├── performance-monitor.tsx    # Performance tracking
│       └── hft-keyboard-shortcuts.tsx # Keyboard navigation
├── stores/
│   ├── hft-order-store.ts            # Normalized state store
│   └── order-store.ts                # Legacy store
├── services/
│   └── websocket-manager.ts          # WebSocket handling
├── workers/
│   └── web-worker.ts                 # Data processing worker
└── styles/
    └── hft-styles.css                # HFT-optimized styles
```

## 🎯 Performance Targets

### Critical Metrics
- **Render Time**: <16ms (60fps)
- **WebSocket Latency**: <100ms
- **Memory Usage**: <500MB
- **FPS**: >30 (target 60)
- **Update Frequency**: 50-100ms throttled

### Optimization Techniques
1. **Virtualization**: Only render visible rows
2. **Memoization**: React.memo and useMemo extensively
3. **Delta Updates**: Update only changed cells
4. **Web Workers**: Offload heavy processing
5. **Throttling**: Batch updates for smooth rendering
6. **Fixed Layouts**: Prevent layout thrashing
7. **GPU Acceleration**: CSS transforms and will-change

## 🔧 Configuration

### HFT Mode Settings
The application can be configured for different performance modes:

```typescript
// In page.tsx
const useHFTMode = true;              // Enable HFT optimizations
const useAGGrid = true;               // Use AG Grid Enterprise
const enableRealTimeUpdates = true;   // Real-time data streaming
const enablePerformanceMonitoring = true; // Performance tracking
```

### Performance Thresholds
```typescript
thresholds: {
  maxRenderTime: 16,    // 60fps target
  minFps: 30,           // Minimum acceptable FPS
  maxLatency: 100       // Maximum WebSocket latency
}
```

## 📈 Monitoring & Debugging

### Performance Monitor
Real-time performance dashboard showing:
- Current FPS
- Render time
- Memory usage
- WebSocket status
- Data processing metrics
- Performance grade (A+ to C)

### Debug Mode
Set `isDebugMode = true` in `page.tsx` for:
- Legacy component fallback
- Detailed logging
- Performance debugging
- Data flow visualization

## 🚦 Production Deployment

### Build Optimizations
- **Code Splitting**: Separate AG Grid and trading utilities
- **Tree Shaking**: Remove unused code
- **Minification**: SWC for fast builds
- **Compression**: Gzip/Brotli enabled
- **Caching**: Aggressive asset caching

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- CSP for WebSocket connections

### Environment Variables
```env
NODE_ENV=production
HFT_MODE=true
WS_URL=wss://your-trading-server.com/ws
AG_GRID_LICENSE_KEY=your_production_license
```

## 🧪 Testing

### Performance Testing
```bash
# Run with performance monitoring
npm run dev

# Load test with sample data
# Use "Load Basic Data" button in UI

# Monitor performance metrics in real-time
# Check Performance Monitor in top-right corner
```

### Keyboard Testing
- Press F1 to view all keyboard shortcuts
- Test navigation with arrow keys
- Verify hotkeys work without focus on inputs

## 📚 Additional Resources

- [AG Grid Documentation](https://ag-grid.com/react-data-grid/)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Immer Immutable Updates](https://immerjs.github.io/immer/)
- [Web Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [React 18 Concurrent Features](https://react.dev/blog/2022/03/29/react-v18)

## 🤝 Contributing

1. Follow the performance-first architecture
2. Maintain <16ms render times
3. Test with high-frequency data updates
4. Ensure keyboard accessibility
5. Monitor performance metrics

## 📄 License

MIT License - See LICENSE file for details.

---

**Built for High-Frequency Trading** 🚀
*Performance First • Real-time Data • Keyboard Navigation*
