'use client';

import React, { useEffect, useState } from 'react';
import { useHFTOrderStore } from '@/stores/hft-order-store';
import AGGridTradingTable from '@/components/trading-blotter/ag-grid-trading-table';
import { SampleDataLoader } from '@/components/sample-data-loader';

interface HFTTradingPlatformProps {
  enableWebSocket?: boolean;
  webSocketUrl?: string;
}

export function HFTTradingPlatform({ 
  enableWebSocket = false,
  webSocketUrl = 'ws://localhost:8080/trading'
}: HFTTradingPlatformProps) {
  const {
    initializeWebSocket,
    disconnectWebSocket,
    connectionState,
    getOrderStats,
    error
  } = useHFTOrderStore();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    clientOrders: 0,
    algoOrders: 0,
    marketOrders: 0,
    totalValue: 0,
    fillRate: 0
  });
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (enableWebSocket) {
      initializeWebSocket(webSocketUrl).catch(error => {
        console.error('Failed to initialize WebSocket:', error);
      });
      
      return () => {
        disconnectWebSocket();
      };
    }
  }, [enableWebSocket, webSocketUrl, initializeWebSocket, disconnectWebSocket]);
  
  // Update stats periodically
  useEffect(() => {
    const updateStats = () => {
      const orderStats = getOrderStats();
      setStats(orderStats);
    };
    
    updateStats();
    const interval = setInterval(updateStats, 1000);
    
    return () => clearInterval(interval);
  }, [getOrderStats]);
  
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* HFT Header with Real-time Stats - Responsive */}
      <div className="bg-black border-b border-gray-700 p-2 sm:p-3 lg:p-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 lg:gap-0">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 font-mono mb-1 sm:mb-2">
              <span className="hidden sm:inline">HFT TRADING PLATFORM</span>
              <span className="sm:hidden">HFT PLATFORM</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionState === 'CONNECTED' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-300">
                  <span className="hidden sm:inline">WebSocket: </span>
                  <span className={connectionState === 'CONNECTED' ? 'text-green-400' : 'text-red-400'}>
                    {connectionState}
                  </span>
                </span>
              </div>
              {error && (
                <div className="text-red-400 text-xs">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
          
          {/* Real-time Statistics - Responsive Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 font-mono">
                {stats.totalOrders.toLocaleString()}
              </div>
              <div className="text-2xs sm:text-xs text-gray-400">
                <span className="hidden sm:inline">Total Orders</span>
                <span className="sm:hidden">Orders</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 font-mono">
                ${(stats.totalValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-2xs sm:text-xs text-gray-400">
                <span className="hidden sm:inline">Total Value</span>
                <span className="sm:hidden">Value</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400 font-mono">
                {stats.fillRate.toFixed(1)}%
              </div>
              <div className="text-2xs sm:text-xs text-gray-400">
                <span className="hidden sm:inline">Fill Rate</span>
                <span className="sm:hidden">Fill</span>
              </div>
            </div>
          </div>
          
          {/* Data Controls - Responsive */}
          <div className="flex flex-col lg:items-end gap-2 mt-3 lg:mt-0">
            <SampleDataLoader />
            <div className="text-2xs sm:text-xs text-gray-400 text-left lg:text-right">
              <span className="hidden sm:inline">⚡ Real-time Data Engine<br/>🚀 Performance Optimized</span>
              <span className="sm:hidden">⚡ Real-time<br/>🚀 Optimized</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Breakdown - Responsive */}
      <div className="bg-gray-800 border-b border-gray-700 px-2 sm:px-3 lg:px-4 py-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 lg:gap-6 overflow-x-auto">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-300">
                <span className="hidden sm:inline">Client Orders: </span>
                <span className="sm:hidden">Client: </span>
                <span className="text-blue-400 font-mono">{stats.clientOrders}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-300">
                <span className="hidden sm:inline">Algo Orders: </span>
                <span className="sm:hidden">Algo: </span>
                <span className="text-orange-400 font-mono">{stats.algoOrders}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-300">
                <span className="hidden sm:inline">Market Orders: </span>
                <span className="sm:hidden">Market: </span>
                <span className="text-green-400 font-mono">{stats.marketOrders}</span>
              </span>
            </div>
          </div>
          
          <div className="text-gray-400 text-2xs sm:text-xs text-center sm:text-right">
            <span className="hidden sm:inline">Last Update: </span>
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Main Trading Grid - Responsive Padding and Height */}
      <div className="flex-1 p-2 sm:p-3 lg:p-4">
        <AGGridTradingTable 
          height="calc(100vh - 280px)"
          enableRealTimeUpdates={true}
        />
      </div>
      
      
    </div>
  );
}

export default HFTTradingPlatform;
