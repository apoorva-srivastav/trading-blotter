'use client';

import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, ColumnApi, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import { useHFTOrderStore } from '@/stores/hft-order-store';
import { ClientOrder, AlgoOrder, OrderLevel } from '@repo/types';

// Custom cell renderers for financial data
const PriceCellRenderer = (params: any) => {
  const value = params.value;
  if (value == null) return '-';
  
  const formatted = typeof value === 'number' ? `$${value.toFixed(2)}` : value;
  return formatted;
};

const QuantityCellRenderer = (params: any) => {
  const value = params.value;
  if (value == null) return '-';
  
  return value.toLocaleString();
};

const SideCellRenderer = (params: any) => {
  return params.value?.toUpperCase() || '-';
};

const StatusCellRenderer = (params: any) => {
  return params.value?.toUpperCase() || '-';
};

const FillPercentCellRenderer = (params: any) => {
  const value = params.value;
  if (value == null) return '-';
  
  const percentage = typeof value === 'number' ? value : parseFloat(value);
  return `${percentage.toFixed(1)}%`;
};

const TimeCellRenderer = (params: any) => {
  const value = params.value;
  if (!value) return '-';
  
  const time = new Date(value).toLocaleTimeString();
  return time;
};

// Hierarchical data structure for AG Grid Tree Data
interface HierarchicalOrderData {
  orderId: number;
  level: OrderLevel;
  symbol: string;
  side: string;
  quantity: number;
  doneQuantity: number;
  donePercent: number;
  price: number;
  averagePrice?: number;
  state: string;
  updated: string;
  algorithm?: string;
  clientName?: string;
  trader?: string;
  account?: string;
  orderValue: number;
  doneValue: number;
  
  // Tree data properties
  orgHierarchy?: string[];
  children?: HierarchicalOrderData[];
  
  // Performance tracking
  _prevPrice?: number;
  _lastUpdate?: number;
}

interface AGGridTradingTableProps {
  height?: string;
  enableRealTimeUpdates?: boolean;
}

export function AGGridTradingTable({ 
  height = '600px',
  enableRealTimeUpdates = true 
}: AGGridTradingTableProps) {
  const {
    getFilteredClientOrders,
    selectedOrder,
    setSelectedOrder,
    updateOrder,
    trackRender
  } = useHFTOrderStore();
  
  const gridRef = useRef<AgGridReact>(null);
  const gridApiRef = useRef<GridApi | null>(null);
  const columnApiRef = useRef<ColumnApi | null>(null);
  
  // Track renders for performance monitoring
  useEffect(() => {
    trackRender();
  });
  
  // Transform data for AG Grid - flatten all orders into a single list
  const flattenedData = useMemo(() => {
    const orders = getFilteredClientOrders();
    const result: HierarchicalOrderData[] = [];
    
    orders.forEach(clientOrder => {
      // Add client order
      result.push({
        orderId: clientOrder.orderId,
        level: 'Client',
        symbol: clientOrder.symbol,
        side: clientOrder.side,
        quantity: clientOrder.quantity,
        doneQuantity: clientOrder.doneQuantity,
        donePercent: clientOrder.donePercent,
        price: clientOrder.price,
        averagePrice: clientOrder.averagePrice,
        state: clientOrder.state,
        updated: clientOrder.updated,
        clientName: clientOrder.clientName,
        trader: clientOrder.trader,
        account: clientOrder.account,
        orderValue: clientOrder.orderValue,
        doneValue: clientOrder.doneValue
      });
      
      // Add algo orders
      clientOrder.algoOrders.forEach(algoOrder => {
        result.push({
          orderId: algoOrder.orderId,
          level: 'Algo',
          symbol: algoOrder.symbol,
          side: algoOrder.side,
          quantity: algoOrder.quantity,
          doneQuantity: algoOrder.doneQuantity,
          donePercent: algoOrder.donePercent,
          price: algoOrder.price,
          averagePrice: algoOrder.averagePrice,
          state: algoOrder.state,
          updated: algoOrder.updated,
          algorithm: algoOrder.algorithm,
          orderValue: algoOrder.orderValue,
          doneValue: algoOrder.doneValue
        });
        
        // Add market orders (limited for performance)
        const limitedMarketOrders = algoOrder.marketOrders.slice(0, 10);
        limitedMarketOrders.forEach(marketOrder => {
          result.push({
            orderId: marketOrder.orderId,
            level: 'Market',
            symbol: marketOrder.symbol,
            side: marketOrder.side,
            quantity: marketOrder.quantity,
            doneQuantity: marketOrder.doneQuantity,
            donePercent: marketOrder.donePercent,
            price: marketOrder.price,
            averagePrice: marketOrder.averagePrice,
            state: marketOrder.state,
            updated: marketOrder.updated,
            orderValue: marketOrder.orderValue,
            doneValue: marketOrder.doneValue
          });
        });
      });
    });
    
    return result;
  }, [getFilteredClientOrders]);
  
  // Column definitions optimized for trading
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Level',
      field: 'level',
      width: 100,
      pinned: 'left',
      cellRenderer: (params: any) => {
        const level = params.value;
        
        switch (level) {
          case 'Client':
            return 'CLIENT';
          case 'Algo':
            return 'ALGO';
          case 'Market':
            return 'MKT';
          default:
            return level;
        }
      },
      sortable: true,
      filter: true
    },
    {
      headerName: 'Order ID',
      field: 'orderId',
      width: 120,
      pinned: 'left',
      cellClass: 'font-mono',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Symbol',
      field: 'symbol',
      width: 100,
      sortable: true,
      filter: true,
      cellClass: 'font-semibold'
    },
    {
      headerName: 'Side',
      field: 'side',
      width: 80,
      cellRenderer: SideCellRenderer,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      width: 120,
      cellRenderer: QuantityCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn'
    },
    {
      headerName: 'Done Qty',
      field: 'doneQuantity',
      width: 120,
      cellRenderer: QuantityCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn'
    },
    {
      headerName: 'Fill %',
      field: 'donePercent',
      width: 100,
      cellRenderer: FillPercentCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn'
    },
    {
      headerName: 'Price',
      field: 'price',
      width: 120,
      cellRenderer: PriceCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      cellClass: 'text-right'
    },
    {
      headerName: 'Avg Price',
      field: 'averagePrice',
      width: 120,
      cellRenderer: PriceCellRenderer,
      sortable: true,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      cellClass: 'text-right'
    },
    {
      headerName: 'Status',
      field: 'state',
      width: 120,
      cellRenderer: StatusCellRenderer,
      sortable: true,
      filter: true
    },
    {
      headerName: 'Algorithm',
      field: 'algorithm',
      width: 120,
      sortable: true,
      filter: true,
      hide: false
    },
    {
      headerName: 'Updated',
      field: 'updated',
      width: 120,
      cellRenderer: TimeCellRenderer,
      sortable: true,
      filter: 'agDateColumnFilter'
    }
  ], []);
  
  // Grid options optimized for performance
  const gridOptions = useMemo(() => ({
    // AG Grid v33 Theming API
    theme: themeQuartz,
    
    // Performance optimizations
    rowBuffer: 10,
    rowSelection: 'single',
    animateRows: false,
    enableCellChangeFlash: true,
    suppressRowClickSelection: false,
    
    // Virtualization
    rowModelType: 'clientSide',
    
    // Delta updates for high-frequency changes
    deltaRowDataMode: true,
    getRowId: (params: any) => `${params.data.orderId}-${params.data.level}`,
    
    // Keyboard navigation
    suppressCellFocus: false,
    
    // Column resizing
    suppressColumnMoveAnimation: true,
    suppressAnimationFrame: false,
    
    // Styling
    headerHeight: 40,
    rowHeight: 35,
    
    // No layout shift
    suppressColumnVirtualisation: false,
    suppressRowVirtualisation: false
  }), []);
  
  // Grid event handlers
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    columnApiRef.current = params.columnApi;
    
    // Auto-size columns
    params.api.sizeColumnsToFit();
  }, []);
  
  const onSelectionChanged = useCallback(() => {
    if (!gridApiRef.current) return;
    
    const selectedRows = gridApiRef.current.getSelectedRows();
    if (selectedRows.length > 0) {
      const row = selectedRows[0];
      setSelectedOrder({
        orderId: row.orderId,
        level: row.level
      });
    } else {
      setSelectedOrder(null);
    }
  }, [setSelectedOrder]);
  
  const onCellValueChanged = useCallback((event: CellValueChangedEvent) => {
    // Handle real-time cell updates
    if (enableRealTimeUpdates && event.data && event.oldValue !== event.newValue) {
      updateOrder(event.data.orderId, event.data.level, {
        [event.colDef.field!]: event.newValue
      });
    }
  }, [updateOrder, enableRealTimeUpdates]);
  
  // Real-time updates using AG Grid's transaction API
  useEffect(() => {
    if (!gridApiRef.current || !enableRealTimeUpdates) return;
    
    // Simulate real-time price updates
    const interval = setInterval(() => {
      const allNodes: any[] = [];
      gridApiRef.current!.forEachNode(node => {
        if (node.data && node.data.level === 'Market') {
          allNodes.push(node);
        }
      });
      
      if (allNodes.length > 0) {
        const randomNode = allNodes[Math.floor(Math.random() * allNodes.length)];
        const currentPrice = randomNode.data.price;
        const newPrice = currentPrice + (Math.random() - 0.5) * 0.1;
        
        // Store previous price for flash effect
        randomNode.data._prevPrice = currentPrice;
        
        // Use transaction API for efficient updates
        gridApiRef.current!.applyTransactionAsync({
          update: [{
            ...randomNode.data,
            price: newPrice,
            updated: new Date().toISOString()
          }]
        });
      }
    }, 100); // 10fps updates
    
    return () => clearInterval(interval);
  }, [enableRealTimeUpdates]);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">High-Performance Trading Grid</h2>
            <p className="text-sm text-gray-600">
              AG Grid Community • Delta Updates • Virtualization
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div>Rows: {flattenedData.length}</div>
            <div className={`px-2 py-1 rounded text-xs ${
              enableRealTimeUpdates 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {enableRealTimeUpdates ? 'LIVE' : 'STATIC'}
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="ag-theme-alpine"
        style={{ height, width: '100%' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={flattenedData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onCellValueChanged={onCellValueChanged}
          suppressMenuHide={true}
        />
      </div>
      
      {/* Performance indicators */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <div>⚡ Optimized for HFT: Delta Updates • Virtualization • Flash Indicators</div>
          <div className="flex gap-4">
            <div>Selected: {selectedOrder ? `${selectedOrder.orderId} (${selectedOrder.level})` : 'None'}</div>
            <div>Last Update: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AGGridTradingTable;
