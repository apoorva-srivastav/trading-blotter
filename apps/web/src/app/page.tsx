'use client';

import dynamicImport from 'next/dynamic';
import React, { Suspense, useEffect } from 'react';
import { useHFTOrderStore } from '@/stores/hft-order-store';
import { mockTradingData } from '@/lib/mock-trading-data';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Loading component optimized for HFT
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
        <div className="text-green-400 font-mono text-sm">
          Loading HFT Trading Platform...
        </div>
        <div className="text-gray-400 font-mono text-xs mt-2">
          Initializing real-time data engine
        </div>
      </div>
    </div>
  );
}

// Dynamically import HFT-optimized components
const HFTTradingPlatform = dynamicImport(
  () => import('@/components/hft-trading-platform').then(mod => ({ default: mod.HFTTradingPlatform })),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

const LinkedOrderTables = dynamicImport(
  () => import('@/components/trading-blotter/linked-order-tables').then(mod => ({ default: mod.LinkedOrderTables })),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

const PerformanceMonitor = dynamicImport(
  () => import('@/components/ui/performance-monitor').then(mod => ({ default: mod.PerformanceMonitor })),
  { 
    ssr: false,
    loading: () => null
  }
);

const HFTKeyboardShortcuts = dynamicImport(
  () => import('@/components/ui/hft-keyboard-shortcuts').then(mod => ({ default: mod.HFTKeyboardShortcuts })),
  { 
    ssr: false,
    loading: () => null
  }
);

// Legacy components for fallback
const TradingBlotterWithHierarchy = dynamicImport(
  () => import('@/components/trading-blotter/trading-blotter-with-hierarchy').then(mod => ({ default: mod.TradingBlotterWithHierarchy })),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
);

export default function Home() {
  // Initialize store with mock data on mount
  const setClientOrders = useHFTOrderStore(state => state.setClientOrders);
  
  useEffect(() => {
    // Load mock data into the store
    console.log('Loading mock trading data...', mockTradingData.length, 'orders');
    setClientOrders(mockTradingData);
  }, [setClientOrders]);
  
  // HFT Configuration
  const useHFTMode = true; // Enable high-frequency trading optimizations
  const useAGGrid = true; // Use AG Grid Enterprise for maximum performance
  const enablePerformanceMonitoring = false; // Monitor performance metrics
  
  // Fallback mode for debugging
  const isDebugMode = false;
  
  // Trading actions for keyboard shortcuts
  const handleCancelOrder = (orderId: number) => {
    console.log(`Cancelling order ${orderId}`);
    // Implement cancel order logic
  };
  
  const handleSliceOrder = (orderId: number) => {
    console.log(`Slicing order ${orderId}`);
    // Implement slice order logic
  };
  
  const handleModifyOrder = (orderId: number) => {
    console.log(`Modifying order ${orderId}`);
    // Implement modify order logic
  };
  
  const handleNewOrder = () => {
    console.log('Creating new order');
    // Implement new order logic
  };
  
  try {
    if (isDebugMode) {
      // Debug mode with legacy components
      return (
        <main className="min-h-screen bg-gray-100">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4 mt-4">
            <strong>🔧 DEBUG MODE ACTIVE:</strong> Using legacy components for debugging.
          </div>
          <TradingBlotterWithHierarchy />
        </main>
      );
    }
    
    if (useHFTMode) {
      // High-Frequency Trading Mode with all optimizations
      return (
        <Suspense fallback={<LoadingSpinner />}>
            <main className="min-h-screen bg-gray-900 text-white">
              {/* HFT Header - Responsive */}
              <div className="bg-black border-b border-gray-700 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 font-mono">
                      <span className="hidden sm:inline">HFT TRADING PLATFORM</span>
                      <span className="sm:hidden">HFT PLATFORM</span>
                    </h1>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-mono">LIVE</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-2xs sm:text-xs font-mono">
                    <div className="text-gray-400">
                      <span className="hidden lg:inline">🚀 Performance Optimized • ⚡ Real-time Data • ⌨️ Keyboard First</span>
                      <span className="hidden sm:inline lg:hidden">🚀 Optimized • ⚡ Real-time • ⌨️ Keyboard</span>
                      <span className="sm:hidden">🚀 ⚡ ⌨️</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Trading Interface - Responsive Height */}
              {useAGGrid ? (
                <div>
                  <LinkedOrderTables />
                </div>
              ) : (
                <HFTTradingPlatform />
              )}
              
              
              {/* HFT Status Bar - Responsive */}
              <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 px-3 sm:px-4 lg:px-6 py-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-2xs sm:text-xs font-mono">
                  <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-x-auto">
                    <div className="text-green-400 whitespace-nowrap">
                     
                    </div>
                    <div className="text-blue-400 whitespace-nowrap">
                     
                    </div>
                    <div className="text-yellow-400 whitespace-nowrap">
                      
                    </div>
                    <div className="text-purple-400 whitespace-nowrap">
                      
                    </div>
                  </div>
                  <div className="text-gray-400 text-center sm:text-right">
                    
                  </div>
                </div>
              </div>
            </main>
        </Suspense>
      );
    }
    
    // Standard mode (fallback)
    return (
      <main className="min-h-screen">
        <TradingBlotterWithHierarchy />
      </main>
    );
    
  } catch (error) {
    console.error('Error rendering HFT Trading Platform:', error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-red-900">
        <div className="bg-red-800 border border-red-600 text-red-100 px-6 py-4 rounded-lg">
          <div className="font-bold text-lg mb-2">🚨 TRADING PLATFORM ERROR</div>
          <div className="text-sm">
            Critical error loading HFT trading platform. Please check console for details.
          </div>
          <div className="text-xs mt-2 text-red-300">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </main>
    );
  }
}

