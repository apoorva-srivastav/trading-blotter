'use client';

import React, { useEffect, useCallback } from 'react';
import { useHFTOrderStore } from '@/stores/hft-order-store';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

interface HFTKeyboardShortcutsProps {
  onCancelOrder?: (orderId: number) => void;
  onSliceOrder?: (orderId: number) => void;
  onModifyOrder?: (orderId: number) => void;
  onNewOrder?: () => void;
  children: React.ReactNode;
}

export function HFTKeyboardShortcuts({
  onCancelOrder,
  onSliceOrder,
  onModifyOrder,
  onNewOrder,
  children
}: HFTKeyboardShortcutsProps) {
  const {
    selectedOrder,
    setSelectedOrder,
    expandAll,
    collapseAll,
    clearFilters,
    getFilteredClientOrders
  } = useHFTOrderStore();
  
  const shortcuts = useCallback((): KeyboardShortcut[] => [
    // Order Management
    {
      key: 'Delete',
      description: 'Cancel selected order',
      action: () => {
        if (selectedOrder && onCancelOrder) {
          onCancelOrder(selectedOrder.orderId);
        }
      }
    },
    {
      key: 'F2',
      description: 'Modify selected order',
      action: () => {
        if (selectedOrder && onModifyOrder) {
          onModifyOrder(selectedOrder.orderId);
        }
      }
    },
    {
      key: 'F3',
      description: 'Slice selected order',
      action: () => {
        if (selectedOrder && onSliceOrder) {
          onSliceOrder(selectedOrder.orderId);
        }
      }
    },
    {
      key: 'F9',
      description: 'New order',
      action: () => {
        if (onNewOrder) {
          onNewOrder();
        }
      }
    },
    
    // Navigation
    {
      key: 'ArrowUp',
      description: 'Select previous order',
      action: () => {
        const orders = getFilteredClientOrders();
        if (!selectedOrder || orders.length === 0) return;
        
        const currentIndex = orders.findIndex(order => 
          order.orderId === selectedOrder.orderId && order.level === selectedOrder.level
        );
        
        if (currentIndex > 0) {
          const prevOrder = orders[currentIndex - 1];
          setSelectedOrder({ orderId: prevOrder.orderId, level: prevOrder.level });
        }
      }
    },
    {
      key: 'ArrowDown',
      description: 'Select next order',
      action: () => {
        const orders = getFilteredClientOrders();
        if (!selectedOrder || orders.length === 0) return;
        
        const currentIndex = orders.findIndex(order => 
          order.orderId === selectedOrder.orderId && order.level === selectedOrder.level
        );
        
        if (currentIndex >= 0 && currentIndex < orders.length - 1) {
          const nextOrder = orders[currentIndex + 1];
          setSelectedOrder({ orderId: nextOrder.orderId, level: nextOrder.level });
        }
      }
    },
    {
      key: 'Home',
      description: 'Select first order',
      action: () => {
        const orders = getFilteredClientOrders();
        if (orders.length > 0) {
          const firstOrder = orders[0];
          setSelectedOrder({ orderId: firstOrder.orderId, level: firstOrder.level });
        }
      }
    },
    {
      key: 'End',
      description: 'Select last order',
      action: () => {
        const orders = getFilteredClientOrders();
        if (orders.length > 0) {
          const lastOrder = orders[orders.length - 1];
          setSelectedOrder({ orderId: lastOrder.orderId, level: lastOrder.level });
        }
      }
    },
    
    // View Controls
    {
      key: '+',
      description: 'Expand all orders',
      ctrlKey: true,
      action: expandAll
    },
    {
      key: '-',
      description: 'Collapse all orders',
      ctrlKey: true,
      action: collapseAll
    },
    {
      key: 'r',
      description: 'Clear all filters',
      ctrlKey: true,
      action: clearFilters
    },
    
    // Quick Actions
    {
      key: 'Escape',
      description: 'Clear selection',
      action: () => setSelectedOrder(null)
    },
    {
      key: 'F5',
      description: 'Refresh data',
      action: () => {
        // Trigger data refresh
        window.location.reload();
      }
    },
    
    // Trading Shortcuts
    {
      key: 'b',
      description: 'Quick Buy',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        console.log('Quick Buy triggered');
        // Implement quick buy logic
      }
    },
    {
      key: 's',
      description: 'Quick Sell',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        console.log('Quick Sell triggered');
        // Implement quick sell logic
      }
    },
    
    // Emergency Actions
    {
      key: 'F12',
      description: 'Emergency stop all orders',
      action: () => {
        const confirmed = window.confirm('Emergency stop all orders? This action cannot be undone.');
        if (confirmed) {
          console.log('Emergency stop triggered');
          // Implement emergency stop logic
        }
      }
    }
  ], [selectedOrder, onCancelOrder, onSliceOrder, onModifyOrder, onNewOrder, setSelectedOrder, expandAll, collapseAll, clearFilters, getFilteredClientOrders]);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent shortcuts when typing in input fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }
    
    const shortcut = shortcuts().find(s => {
      const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !!s.ctrlKey === event.ctrlKey;
      const shiftMatch = !!s.shiftKey === event.shiftKey;
      const altMatch = !!s.altKey === event.altKey;
      
      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });
    
    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
      
      // Visual feedback
      showKeyboardFeedback(shortcut.description);
    }
  }, [shortcuts]);
  
  const showKeyboardFeedback = (description: string) => {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
    feedback.textContent = description;
    document.body.appendChild(feedback);
    
    // Remove after 2 seconds
    setTimeout(() => {
      if (document.body.contains(feedback)) {
        document.body.removeChild(feedback);
      }
    }, 2000);
  };
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <div className="relative">
      {children}
      
      {/* Keyboard shortcuts help panel */}
      <KeyboardShortcutsHelp shortcuts={shortcuts()} />
    </div>
  );
}

// Help panel component
interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
}

function KeyboardShortcutsHelp({ shortcuts }: KeyboardShortcutsHelpProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    parts.push(shortcut.key);
    return parts.join(' + ');
  };
  
  const groupedShortcuts = React.useMemo(() => {
    const groups: { [key: string]: KeyboardShortcut[] } = {
      'Order Management': [],
      'Navigation': [],
      'View Controls': [],
      'Quick Actions': [],
      'Trading': [],
      'Emergency': []
    };
    
    shortcuts.forEach(shortcut => {
      if (['Delete', 'F2', 'F3', 'F9'].includes(shortcut.key)) {
        groups['Order Management'].push(shortcut);
      } else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(shortcut.key)) {
        groups['Navigation'].push(shortcut);
      } else if (['+', '-', 'r'].includes(shortcut.key)) {
        groups['View Controls'].push(shortcut);
      } else if (['Escape', 'F5'].includes(shortcut.key)) {
        groups['Quick Actions'].push(shortcut);
      } else if (['b', 's'].includes(shortcut.key)) {
        groups['Trading'].push(shortcut);
      } else if (['F12'].includes(shortcut.key)) {
        groups['Emergency'].push(shortcut);
      }
    });
    
    return groups;
  }, [shortcuts]);
  
  return (
    <>
      {/* Help toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40"
        title="Keyboard Shortcuts (F1)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </button>
      
      {/* Help panel */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedShortcuts).map(([group, groupShortcuts]) => (
                  groupShortcuts.length > 0 && (
                    <div key={group} className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        {group}
                      </h3>
                      <div className="space-y-2">
                        {groupShortcuts.map((shortcut, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{shortcut.description}</span>
                            <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                              {formatShortcut(shortcut)}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Trading Safety Notice:</p>
                    <p>Keyboard shortcuts are designed for speed but use them carefully. Emergency actions (F12) require confirmation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HFTKeyboardShortcuts;
