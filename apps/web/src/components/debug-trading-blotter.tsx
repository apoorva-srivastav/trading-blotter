'use client';

import React from 'react';
import { ComprehensiveDebugPanel } from './comprehensive-debug-panel';
import { MinimalTableTest } from './minimal-table-test';

export function DebugTradingBlotter() {
  return (
    <div className="min-h-screen bg-gray-100">
      <ComprehensiveDebugPanel />
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <MinimalTableTest />
      </div>
    </div>
  );
}