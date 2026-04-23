'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useHFTOrderStore } from '@/stores/hft-order-store';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  updateLatency: number;
  memoryUsage: number;
  cpuUsage: number;
  wsLatency: number;
  dataProcessingTime: number;
  gridRenderTime: number;
}

interface PerformanceMonitorProps {
  isVisible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  enableAlerts?: boolean;
  thresholds?: {
    maxRenderTime: number;
    minFps: number;
    maxLatency: number;
  };
}

export function PerformanceMonitor({
  isVisible = true,
  position = 'top-right',
  enableAlerts = true,
  thresholds = {
    maxRenderTime: 16, // 60fps = 16ms per frame
    minFps: 30,
    maxLatency: 100 // 100ms max acceptable latency
  }
}: PerformanceMonitorProps) {
  const { getPerformanceMetrics, connectionState } = useHFTOrderStore();
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    updateLatency: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    wsLatency: 0,
    dataProcessingTime: 0,
    gridRenderTime: 0
  });
  
  const [alerts, setAlerts] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // FPS calculation
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());
  
  const measureFPS = useCallback(() => {
    const now = Date.now();
    const delta = now - lastTime;
    
    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta);
      setMetrics(prev => ({ ...prev, fps }));
      setFrameCount(0);
      setLastTime(now);
    } else {
      setFrameCount(prev => prev + 1);
    }
  }, [frameCount, lastTime]);
  
  // Performance measurement
  const measurePerformance = useCallback(() => {
    const storeMetrics = getPerformanceMetrics();
    
    // Memory usage (if available)
    const memoryUsage = (performance as any).memory 
      ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
      : 0;
    
    // Simulated WebSocket latency (in real app, measure actual ping)
    const wsLatency = connectionState === 'CONNECTED' 
      ? Math.random() * 50 + 10 // 10-60ms simulated
      : 0;
    
    // Data processing time (from store)
    const dataProcessingTime = storeMetrics.avgUpdateInterval;
    
    setMetrics(prev => ({
      ...prev,
      renderTime: storeMetrics.lastRenderTime ? Date.now() - storeMetrics.lastRenderTime : 0,
      updateLatency: dataProcessingTime,
      memoryUsage,
      wsLatency,
      dataProcessingTime
    }));
    
    // Check for performance alerts
    if (enableAlerts) {
      const newAlerts: string[] = [];
      
      if (metrics.fps < thresholds.minFps && metrics.fps > 0) {
        newAlerts.push(`Low FPS: ${metrics.fps} (target: >${thresholds.minFps})`);
      }
      
      if (metrics.renderTime > thresholds.maxRenderTime) {
        newAlerts.push(`High render time: ${metrics.renderTime}ms (target: <${thresholds.maxRenderTime}ms)`);
      }
      
      if (metrics.wsLatency > thresholds.maxLatency) {
        newAlerts.push(`High latency: ${metrics.wsLatency}ms (target: <${thresholds.maxLatency}ms)`);
      }
      
      if (memoryUsage > 500) { // 500MB threshold
        newAlerts.push(`High memory usage: ${memoryUsage}MB`);
      }
      
      setAlerts(newAlerts);
    }
  }, [getPerformanceMetrics, connectionState, enableAlerts, thresholds, metrics.fps, metrics.renderTime, metrics.wsLatency]);
  
  // Animation frame for FPS measurement
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      measureFPS();
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [measureFPS]);
  
  // Performance measurement interval
  useEffect(() => {
    const interval = setInterval(measurePerformance, 1000); // Update every second
    return () => clearInterval(interval);
  }, [measurePerformance]);
  
  const getPositionClasses = () => {
    const base = 'fixed z-50';
    switch (position) {
      case 'top-left': return `${base} top-4 left-4`;
      case 'top-right': return `${base} top-4 right-4`;
      case 'bottom-left': return `${base} bottom-4 left-4`;
      case 'bottom-right': return `${base} bottom-4 right-4`;
      default: return `${base} top-4 right-4`;
    }
  };
  
  const getStatusColor = (value: number, threshold: number, inverse = false) => {
    const isGood = inverse ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={getPositionClasses()}>
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-2 space-y-1">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs animate-pulse"
            >
              ⚠️ {alert}
            </div>
          ))}
        </div>
      )}
      
      {/* Main performance panel */}
      <div className="bg-black bg-opacity-80 text-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div 
          className="px-3 py-2 bg-gray-900 cursor-pointer flex justify-between items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionState === 'CONNECTED' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-xs font-mono font-bold">HFT PERF</span>
          </div>
          <div className="text-xs">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
        
        {/* Compact view */}
        {!isExpanded && (
          <div className="px-3 py-2 text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span>FPS:</span>
              <span className={getStatusColor(metrics.fps, thresholds.minFps)}>
                {metrics.fps}
              </span>
            </div>
            <div className="flex justify-between">
              <span>LAT:</span>
              <span className={getStatusColor(metrics.wsLatency, thresholds.maxLatency, true)}>
                {metrics.wsLatency.toFixed(0)}ms
              </span>
            </div>
          </div>
        )}
        
        {/* Expanded view */}
        {isExpanded && (
          <div className="px-3 py-3 text-xs font-mono space-y-2">
            {/* Core Performance Metrics */}
            <div className="space-y-1">
              <div className="text-yellow-400 font-bold border-b border-gray-700 pb-1">
                CORE METRICS
              </div>
              
              <div className="flex justify-between">
                <span>FPS:</span>
                <span className={getStatusColor(metrics.fps, thresholds.minFps)}>
                  {metrics.fps} / 60
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Render Time:</span>
                <span className={getStatusColor(metrics.renderTime, thresholds.maxRenderTime, true)}>
                  {metrics.renderTime.toFixed(1)}ms
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className={getStatusColor(metrics.memoryUsage, 500, true)}>
                  {metrics.memoryUsage}MB
                </span>
              </div>
            </div>
            
            {/* Network Metrics */}
            <div className="space-y-1">
              <div className="text-blue-400 font-bold border-b border-gray-700 pb-1">
                NETWORK
              </div>
              
              <div className="flex justify-between">
                <span>WS Status:</span>
                <span className={connectionState === 'CONNECTED' ? 'text-green-400' : 'text-red-400'}>
                  {connectionState}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Latency:</span>
                <span className={getStatusColor(metrics.wsLatency, thresholds.maxLatency, true)}>
                  {metrics.wsLatency.toFixed(0)}ms
                </span>
              </div>
            </div>
            
            {/* Data Processing */}
            <div className="space-y-1">
              <div className="text-green-400 font-bold border-b border-gray-700 pb-1">
                DATA PROCESSING
              </div>
              
              <div className="flex justify-between">
                <span>Update Interval:</span>
                <span className="text-white">
                  {metrics.dataProcessingTime.toFixed(0)}ms
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Processing:</span>
                <span className="text-white">
                  {metrics.dataProcessingTime < 50 ? 'FAST' : 'SLOW'}
                </span>
              </div>
            </div>
            
            {/* Performance Grade */}
            <div className="pt-2 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Grade:</span>
                <span className={`font-bold ${
                  metrics.fps >= 50 && metrics.wsLatency < 50 && metrics.renderTime < 16
                    ? 'text-green-400'
                    : metrics.fps >= 30 && metrics.wsLatency < 100
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}>
                  {metrics.fps >= 50 && metrics.wsLatency < 50 && metrics.renderTime < 16
                    ? 'A+'
                    : metrics.fps >= 30 && metrics.wsLatency < 100
                    ? 'B'
                    : 'C'}
                </span>
              </div>
            </div>
            
            {/* Optimization Tips */}
            {(metrics.fps < 30 || metrics.wsLatency > 100) && (
              <div className="pt-2 border-t border-gray-700">
                <div className="text-orange-400 text-xs">
                  💡 Tips:
                  {metrics.fps < 30 && <div>• Reduce visible rows</div>}
                  {metrics.wsLatency > 100 && <div>• Check network</div>}
                  {metrics.memoryUsage > 500 && <div>• Clear filters</div>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Micro-throttling indicator */}
      <div className="mt-2 bg-gray-900 bg-opacity-90 text-white px-2 py-1 rounded text-xs font-mono">
        🚀 HFT Mode: {metrics.fps >= 50 ? 'OPTIMAL' : 'DEGRADED'}
      </div>
    </div>
  );
}

export default PerformanceMonitor;
