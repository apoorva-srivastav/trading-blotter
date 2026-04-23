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
      {/* HFT Header with Real-time Stats */}
      <div className="bg-black border-b border-gray-700 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-green-400 font-mono mb-2">
              HFT TRADING PLATFORM
            </h1>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionState === 'CONNECTED' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-300">
                  WebSocket: <span className={connectionState === 'CONNECTED' ? 'text-green-400' : 'text-red-400'}>
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
          
          {/* Real-time Statistics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400 font-mono">
                {stats.totalOrders.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Orders</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-400 font-mono">
                ${(stats.totalValue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-400">Total Value</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-400 font-mono">
                {stats.fillRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">Fill Rate</div>
            </div>
          </div>
          
          {/* Data Controls */}
          <div className="flex flex-col items-end gap-2">
            <SampleDataLoader />
            <div className="text-xs text-gray-400 text-right">
              ⚡ Real-time Data Engine<br/>
              🚀 Performance Optimized
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Breakdown */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-300">
                Client Orders: <span className="text-blue-400 font-mono">{stats.clientOrders}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-300">
                Algo Orders: <span className="text-orange-400 font-mono">{stats.algoOrders}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-300">
                Market Orders: <span className="text-green-400 font-mono">{stats.marketOrders}</span>
              </span>
            </div>
          </div>
          
          <div className="text-gray-400 text-xs">
            Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Main Trading Grid */}
      <div className="flex-1 p-4">
        <AGGridTradingTable 
          height="calc(100vh - 240px)"
          enableRealTimeUpdates={true}
        />
      </div>
      
      {/* HFT Performance Indicators */}
      <div className="bg-black border-t border-gray-700 px-4 py-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="text-green-400">✓ Normalized Store (O(1) lookups)</div>
            <div className="text-blue-400">✓ Immutable Updates (Immer)</div>
            <div className="text-yellow-400">✓ Web Worker Processing</div>
            <div className="text-purple-400">✓ Delta Updates</div>
          </div>
          <div className="text-gray-400">
            HFT Mode: Performance First • Non-blocking UI • Real-time Data Engine
          </div>
        </div>
      </div>
    </div>
  );
}

export default HFTTradingPlatform;
