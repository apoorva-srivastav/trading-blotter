'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, SelectionChangedEvent, GridApi, ICellRendererParams, ValueFormatterParams, GetRowIdParams } from 'ag-grid-community';
import { useHFTOrderStore } from '@/stores/hft-order-store';
import type { MarketOrder } from '@repo/types';

// Combined order type for the unified table showing Client → Algo hierarchy
type CombinedOrder = {
  orderId: number;
  symbol: string;
  side: string;
  quantity: number;
  doneQuantity: number;
  orderValue: number;
  state: string;
  created: string;
  trader: string;
  orderType: 'Client' | 'Algo';
  level: number; // 0 for Client, 1 for Algo (indented)
  parentId?: number; // Parent order ID for hierarchy
  clientOrderId?: number; // For algo orders, reference to parent client order
  // Client-specific fields
  clientName?: string;
  account?: string;
  // Algo-specific fields
  algorithm?: string;
};

type ViewMode = 'combined' | 'flattened';

export function LinkedOrderTables() {
  const [selectedOrderType, setSelectedOrderType] = useState<'client' | 'algo' | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('combined');
  
  // Grid API refs for export functionality
  const combinedGridRef = useRef<GridApi<CombinedOrder> | null>(null);
  const marketGridRef = useRef<GridApi<MarketOrder> | null>(null);
  const flattenedGridRef = useRef<GridApi<any> | null>(null);

  // Get data from the store
  const clientOrders = useHFTOrderStore((state) => state.getFilteredClientOrders());
  const getAlgoOrdersForClient = useHFTOrderStore((state) => state.getAlgoOrdersForClient);
  const getMarketOrdersForAlgo = useHFTOrderStore((state) => state.getMarketOrdersForAlgo);
  
  // Combined orders for the unified table (Client → Algo hierarchy)
  const combinedOrders = useMemo(() => {
    const combined: CombinedOrder[] = [];
    
    // Build the hierarchy: Client → Algo
    clientOrders.forEach(clientOrder => {
      // Add client order at level 0
      combined.push({
        orderId: clientOrder.orderId,
        symbol: clientOrder.symbol,
        side: clientOrder.side,
        quantity: clientOrder.quantity,
        doneQuantity: clientOrder.doneQuantity,
        orderValue: clientOrder.orderValue,
        state: clientOrder.state,
        created: clientOrder.created,
        trader: clientOrder.trader || '',
        orderType: 'Client',
        level: 0,
        clientName: clientOrder.clientName,
        account: clientOrder.account
      });
      
      // Add all algo orders for this client at level 1 (indented)
      const algoOrders = getAlgoOrdersForClient(clientOrder.orderId);
      algoOrders.forEach(algoOrder => {
        combined.push({
          orderId: algoOrder.orderId,
          symbol: algoOrder.symbol,
          side: algoOrder.side,
          quantity: algoOrder.quantity,
          doneQuantity: algoOrder.doneQuantity,
          orderValue: algoOrder.orderValue,
          state: algoOrder.state,
          created: algoOrder.created,
          trader: algoOrder.trader || '',
          orderType: 'Algo',
          level: 1,
          parentId: clientOrder.orderId,
          clientOrderId: clientOrder.orderId,
          algorithm: algoOrder.algorithm
        });
      });
    });
    
    return combined;
  }, [clientOrders, getAlgoOrdersForClient]);

  // Flattened view data - combines all orders into a single hierarchical structure
  const flattenedData = useMemo(() => {
    const flattened: any[] = [];
    
    clientOrders.forEach(clientOrder => {
      // Add client order
      flattened.push({
        ...clientOrder,
        orderType: 'Client',
        level: 0,
        parentId: null
      });
      
      // Add related algo orders
      const relatedAlgoOrders = getAlgoOrdersForClient(clientOrder.orderId);
      relatedAlgoOrders.forEach(algoOrder => {
        flattened.push({
          ...algoOrder,
          orderType: 'Algo',
          level: 1,
          parentId: clientOrder.orderId
        });
        
        // Add related market orders
        const relatedMarketOrders = getMarketOrdersForAlgo(algoOrder.orderId);
        relatedMarketOrders.forEach(marketOrder => {
          flattened.push({
            ...marketOrder,
            orderType: 'Market',
            level: 2,
            parentId: algoOrder.orderId,
            venue: marketOrder.venue
          });
        });
      });
    });
    
    return flattened;
  }, [clientOrders, getAlgoOrdersForClient, getMarketOrdersForAlgo]);

  // Filter market orders based on selection from combined table
  const linkedMarketOrders = useMemo(() => {
    if (!selectedOrderId || !selectedOrderType) return [];

    if (selectedOrderType === 'client') {
      // Get all algo orders for this client order, then get all their market orders
      const relatedAlgoOrders = getAlgoOrdersForClient(selectedOrderId);
      const allMarketOrders: MarketOrder[] = [];
      relatedAlgoOrders.forEach(algoOrder => {
        const marketOrders = getMarketOrdersForAlgo(algoOrder.orderId);
        allMarketOrders.push(...marketOrders);
      });
      return allMarketOrders;
    } else if (selectedOrderType === 'algo') {
      // Get market orders for this specific algo order
      return getMarketOrdersForAlgo(selectedOrderId);
    }

    return [];
  }, [selectedOrderId, selectedOrderType, getAlgoOrdersForClient, getMarketOrdersForAlgo]);

  // Custom cell renderer for order type with indentation
  const orderTypeCellRenderer = (params: ICellRendererParams) => {
    const orderType = params.data?.orderType || '';
    const level = params.data?.level || 0;
    const paddingLeft = level * 24; // 24px indentation per level
    
    const colors: Record<string, string> = {
      'Client': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Algo': 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    
    const icons: Record<string, string> = {
      'Client': '👤',
      'Algo': '🤖'
    };
    
    return (
      <div style={{ paddingLeft: `${paddingLeft}px` }} className="flex items-center h-full">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${colors[orderType] || 'bg-gray-100 text-gray-800'}`}>
          <span>{icons[orderType] || '📋'}</span>
          {orderType}
        </span>
      </div>
    );
  };

  // Column definitions for Combined Orders Table (Client → Algo)
  const combinedOrderColumns: ColDef<CombinedOrder>[] = [
    { 
      field: 'orderId', 
      headerName: 'Order ID', 
      width: 120, 
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      cellClass: 'ag-checkbox-cell'
    },
    { 
      field: 'orderType', 
      headerName: 'Type', 
      width: 140,
      cellRenderer: orderTypeCellRenderer,
      filter: 'agSetColumnFilter',
      pinned: 'left'
    },
    { 
      field: 'clientName', 
      headerName: 'Client Name', 
      width: 150,
      valueGetter: (params) => {
        // Only show client name for client orders or get from parent for algo orders
        if (params.data?.orderType === 'Client') {
          return params.data.clientName;
        } else {
          // For algo orders, find the parent client order
          const clientOrderId = params.data?.clientOrderId;
          const parentClient = clientOrders.find(c => c.orderId === clientOrderId);
          return parentClient?.clientName || '';
        }
      }
    },
    { field: 'symbol', headerName: 'Symbol', width: 100 },
    { field: 'side', headerName: 'Side', width: 80 },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 120,
      valueFormatter: (params) => params.value?.toLocaleString() || '0',
      type: 'numericColumn'
    },
    { 
      field: 'doneQuantity', 
      headerName: 'Filled', 
      width: 120,
      valueFormatter: (params) => params.value?.toLocaleString() || '0',
      type: 'numericColumn'
    },
    {
      headerName: 'Fill %',
      width: 100,
      valueGetter: (params) => {
        const quantity = params.data?.quantity || 0;
        const doneQuantity = params.data?.doneQuantity || 0;
        return quantity > 0 ? ((doneQuantity / quantity) * 100) : 0;
      },
      valueFormatter: (params) => `${params.value?.toFixed(1) || '0.0'}%`,
      type: 'numericColumn'
    },
    { 
      field: 'orderValue', 
      headerName: 'Order Value', 
      width: 130,
      valueFormatter: (params) => params.value ? `$${params.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '$0.00',
      type: 'numericColumn'
    },
    { field: 'state', headerName: 'Status', width: 100 },
    { 
      field: 'created', 
      headerName: 'Created', 
      width: 180,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : ''
    },
    { field: 'trader', headerName: 'Trader', width: 120 },
    { 
      field: 'algorithm', 
      headerName: 'Algorithm', 
      width: 120,
      valueGetter: (params) => {
        return params.data?.orderType === 'Algo' ? params.data.algorithm : '';
      }
    },
    { 
      field: 'account', 
      headerName: 'Account', 
      width: 120,
      valueGetter: (params) => {
        if (params.data?.orderType === 'Client') {
          return params.data.account;
        } else {
          // For algo orders, get account from parent client order
          const clientOrderId = params.data?.clientOrderId;
          const parentClient = clientOrders.find(c => c.orderId === clientOrderId);
          return parentClient?.account || '';
        }
      }
    }
  ];

  // Custom cell renderer for flattened view order type with indentation
  const flattenedOrderTypeCellRenderer = (params: ICellRendererParams) => {
    const level = params.data?.level || 0;
    const paddingLeft = level * 20;
    const orderType = params.data?.orderType || '';
    
    const colors: Record<string, string> = {
      'Client': 'bg-blue-100 text-blue-800',
      'Algo': 'bg-purple-100 text-purple-800',
      'Market': 'bg-green-100 text-green-800'
    };
    
    return (
      <div style={{ paddingLeft: `${paddingLeft}px` }} className="flex items-center h-full">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[orderType] || 'bg-gray-100 text-gray-800'}`}>
          {orderType}
        </span>
      </div>
    );
  };

  // Column definitions for Flattened View
  const flattenedColumns: ColDef[] = [
    { 
      field: 'orderType', 
      headerName: 'Type', 
      width: 150,
      cellRenderer: flattenedOrderTypeCellRenderer,
      filter: 'agSetColumnFilter'
    },
    { field: 'orderId', headerName: 'Order ID', width: 150 },
    { field: 'symbol', headerName: 'Symbol', width: 100 },
    { field: 'side', headerName: 'Side', width: 80 },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 120,
      valueFormatter: (params: ValueFormatterParams) => params.value?.toLocaleString() || '0'
    },
    { 
      field: 'doneQuantity', 
      headerName: 'Filled', 
      width: 120,
      valueFormatter: (params: ValueFormatterParams) => params.value?.toLocaleString() || '0'
    },
    { 
      field: 'orderValue', 
      headerName: 'Order Value', 
      width: 130,
      valueFormatter: (params: ValueFormatterParams) => params.value ? `$${params.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '$0.00'
    },
    { field: 'state', headerName: 'Status', width: 100 },
    { 
      field: 'created', 
      headerName: 'Created', 
      width: 180,
      valueFormatter: (params: ValueFormatterParams) => params.value ? new Date(params.value).toLocaleString() : ''
    },
    { field: 'trader', headerName: 'Trader', width: 120 },
    { field: 'algorithm', headerName: 'Algorithm', width: 120 },
    { field: 'venue', headerName: 'Venue', width: 100 },
    { field: 'clientName', headerName: 'Client', width: 150 }
  ];

  // Column definitions for Market Orders (linked table)
  const marketOrderColumns: ColDef<MarketOrder>[] = [
    { field: 'orderId', headerName: 'Market Order ID', width: 150 },
    { field: 'symbol', headerName: 'Symbol', width: 100 },
    { field: 'side', headerName: 'Side', width: 80 },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 100,
      valueFormatter: (params) => params.value?.toLocaleString() || '0',
      type: 'numericColumn'
    },
    { 
      field: 'doneQuantity', 
      headerName: 'Filled', 
      width: 100,
      valueFormatter: (params) => params.value?.toLocaleString() || '0',
      type: 'numericColumn'
    },
    {
      headerName: 'Fill %',
      width: 90,
      valueGetter: (params) => {
        const quantity = params.data?.quantity || 0;
        const doneQuantity = params.data?.doneQuantity || 0;
        return quantity > 0 ? ((doneQuantity / quantity) * 100) : 0;
      },
      valueFormatter: (params) => `${params.value?.toFixed(1) || '0.0'}%`,
      type: 'numericColumn'
    },
    { 
      field: 'averagePrice', 
      headerName: 'Avg Price', 
      width: 110,
      valueFormatter: (params) => params.value ? `$${params.value.toFixed(2)}` : '$0.00',
      type: 'numericColumn'
    },
    { 
      field: 'orderValue', 
      headerName: 'Order Value', 
      width: 130,
      valueFormatter: (params) => params.value ? `$${params.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '$0.00',
      type: 'numericColumn'
    },
    { field: 'state', headerName: 'Status', width: 100 },
    { 
      field: 'created', 
      headerName: 'Created', 
      width: 180,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : ''
    },
    { field: 'venue', headerName: 'Venue', width: 100 },
    { field: 'trader', headerName: 'Trader', width: 120 }
  ];

  // Handle selection changes for Combined Orders Table
  const onCombinedOrderSelectionChanged = (event: SelectionChangedEvent<CombinedOrder>) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const selectedOrder = selectedRows[0];
      setSelectedOrderType(selectedOrder.orderType.toLowerCase() as 'client' | 'algo');
      setSelectedOrderId(selectedOrder.orderId);
    } else {
      setSelectedOrderType(null);
      setSelectedOrderId(null);
    }
  };

  // Row ID function for stable selection in combined table
  const getCombinedOrderRowId = (params: GetRowIdParams<CombinedOrder>) => {
    return `${params.data.orderType}-${params.data.orderId}`;
  };

  // Export functionality
  const exportToCSV = useCallback((gridType: 'combined' | 'market' | 'flattened') => {
    let gridApi: GridApi | null = null;
    let fileName = 'export.csv';
    
    switch (gridType) {
      case 'combined':
        gridApi = combinedGridRef.current;
        fileName = 'client-algo-orders.csv';
        break;
      case 'market':
        gridApi = marketGridRef.current;
        fileName = 'market-orders.csv';
        break;
      case 'flattened':
        gridApi = flattenedGridRef.current;
        fileName = 'all-orders-flattened.csv';
        break;
    }
    
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName,
        columnKeys: gridApi.getColumns()?.map(col => col.getColId()) || []
      });
    }
  }, []);

  // Grid ready handlers to capture API references
  const onCombinedGridReady = useCallback((params: any) => {
    combinedGridRef.current = params.api;
  }, []);

  const onMarketGridReady = useCallback((params: any) => {
    marketGridRef.current = params.api;
  }, []);

  const onFlattenedGridReady = useCallback((params: any) => {
    flattenedGridRef.current = params.api;
  }, []);

  return (
    <div className="w-full h-screen flex flex-col p-4 gap-4">
      {/* Header with View Toggle and Export Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('combined')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'combined'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Combined View
            </button>
            <button
              onClick={() => setViewMode('flattened')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'flattened'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Flattened View
            </button>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          {viewMode === 'combined' ? (
            <>
              <button
                onClick={() => exportToCSV('combined')}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Export Client & Algo Orders
              </button>
              <button
                onClick={() => exportToCSV('market')}
                disabled={!selectedOrderId}
                className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Export Market Orders
              </button>
            </>
          ) : (
            <button
              onClick={() => exportToCSV('flattened')}
              className="px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Export All Orders
            </button>
          )}
        </div>
      </div>

      {/* Conditional Rendering Based on View Mode */}
      {viewMode === 'combined' ? (
        <div className="flex-1 flex gap-4">
          {/* Left Panel - Combined Client & Algo Orders */}
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                <span>📊</span>
                Client & Algo Orders (Hierarchy)
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>Total: {combinedOrders.length} orders</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></span>
                  {clientOrders.length} Client
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></span>
                  {combinedOrders.length - clientOrders.length} Algo
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Client orders at level 0, Algo orders indented at level 1. Select any order to view related Market orders.
              </p>
            </div>
            <div className="ag-theme-quartz flex-1">
              <AgGridReact<CombinedOrder>
                rowData={combinedOrders}
                columnDefs={combinedOrderColumns}
                rowSelection="single"
                onSelectionChanged={onCombinedOrderSelectionChanged}
                getRowId={getCombinedOrderRowId}
                onGridReady={onCombinedGridReady}
                animateRows={true}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                  floatingFilter: true
                }}
                enableCellTextSelection={true}
                pagination={true}
                paginationPageSize={50}
                paginationPageSizeSelector={[25, 50, 100, 200]}
                rowHeight={40}
                headerHeight={48}
              />
            </div>
          </div>

          {/* Right Panel - Market Orders (Linked Table) */}
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                <span>🎯</span>
                Market Orders
              </h2>
              {selectedOrderId ? (
                <p className="text-sm text-gray-600">
                  Showing {linkedMarketOrders.length} market orders for {selectedOrderType === 'client' ? 'Client Order' : 'Algo Order'}: {selectedOrderId}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Select a Client Order or Algo Order to view related Market Orders</p>
              )}
            </div>
            <div className="ag-theme-quartz flex-1">
              <AgGridReact<MarketOrder>
                rowData={linkedMarketOrders}
                columnDefs={marketOrderColumns}
                onGridReady={onMarketGridReady}
                animateRows={true}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                  floatingFilter: true
                }}
                enableCellTextSelection={true}
                pagination={true}
                paginationPageSize={100}
                paginationPageSizeSelector={[50, 100, 200, 500]}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Flattened View - Single Table with All Orders */
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-indigo-700">All Orders (Hierarchical View)</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {flattenedData.length} total orders across all levels (Client → Algo → Market)
            </p>
          </div>
          <div className="ag-theme-quartz flex-1">
            <AgGridReact
              rowData={flattenedData}
              columnDefs={flattenedColumns}
              onGridReady={onFlattenedGridReady}
              animateRows={true}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                floatingFilter: true
              }}
              enableCellTextSelection={true}
              pagination={true}
              paginationPageSize={100}
              paginationPageSizeSelector={[50, 100, 200, 500, 1000]}
              rowHeight={40}
              headerHeight={48}
            />
          </div>
        </div>
      )}
    </div>
  );
}