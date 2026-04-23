'use client';

import React, { useState, useCallback } from 'react';
import { useOrderStore } from '@/stores/order-store';
import { FilterConfig, BaseOrder, OrderSide, OrderState } from '@repo/types';

// Simple icon components
const MagnifyingGlassIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FunnelIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

// Atomic components
const SearchInput = React.memo<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}>(({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(var(--trading-text-secondary))]">
        <MagnifyingGlassIcon />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--trading-accent))] focus:border-transparent w-full"
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

const FilterChip = React.memo<{
  filter: FilterConfig;
  onRemove: () => void;
}>(({ filter, onRemove }) => {
  const getDisplayValue = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--trading-accent))] bg-opacity-20 border border-[hsl(var(--trading-accent))] rounded-full text-sm">
      <span className="font-medium">{String(filter.column)}:</span>
      <span>{filter.operator} {getDisplayValue(filter.value)}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-[hsl(var(--trading-accent))] hover:bg-opacity-30 rounded-full transition-colors"
      >
        <XMarkIcon />
      </button>
    </div>
  );
});

FilterChip.displayName = 'FilterChip';

// Molecular component for filter dropdown
const FilterDropdown = React.memo<{
  isOpen: boolean;
  onClose: () => void;
  onAddFilter: (filter: FilterConfig) => void;
}>(({ isOpen, onClose, onAddFilter }) => {
  const [selectedColumn, setSelectedColumn] = useState<string>('symbol');
  const [selectedOperator, setSelectedOperator] = useState<FilterConfig['operator']>('equals');
  const [filterValue, setFilterValue] = useState('');

  const filterableColumns: { key: string; label: string; type: 'text' | 'number' | 'select' }[] = [
    { key: 'symbol', label: 'Symbol', type: 'text' },
    { key: 'side', label: 'Side', type: 'select' },
    { key: 'state', label: 'Status', type: 'select' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'donePercent', label: 'Fill %', type: 'number' },
    { key: 'clientName', label: 'Client Name', type: 'text' },
    { key: 'trader', label: 'Trader', type: 'text' },
    { key: 'account', label: 'Account', type: 'text' },
  ];

  const operators: { key: FilterConfig['operator']; label: string }[] = [
    { key: 'equals', label: 'Equals' },
    { key: 'contains', label: 'Contains' },
    { key: 'greaterThan', label: 'Greater than' },
    { key: 'lessThan', label: 'Less than' },
  ];

  const sideOptions: OrderSide[] = ['Buy', 'Sell', 'Short Sell'];
  const statusOptions: OrderState[] = ['New', 'Partially Filled', 'Filled', 'Cancelled', 'Rejected', 'Pending'];

  const handleAddFilter = useCallback(() => {
    if (!filterValue.trim()) return;

    const filter: FilterConfig = {
      column: selectedColumn as keyof BaseOrder,
      operator: selectedOperator,
      value: filterValue.trim()
    };

    onAddFilter(filter);
    setFilterValue('');
    onClose();
  }, [selectedColumn, selectedOperator, filterValue, onAddFilter, onClose]);

  const selectedColumnConfig = filterableColumns.find(col => col.key === selectedColumn);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-80 bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg shadow-lg z-50 p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Column</label>
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="w-full p-2 bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--trading-accent))]"
          >
            {filterableColumns.map(col => (
              <option key={col.key} value={col.key}>{col.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Operator</label>
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value as FilterConfig['operator'])}
            className="w-full p-2 bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--trading-accent))]"
          >
            {operators.map(op => (
              <option key={op.key} value={op.key}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Value</label>
          {selectedColumnConfig?.type === 'select' ? (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full p-2 bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--trading-accent))]"
            >
              <option value="">Select value...</option>
              {selectedColumn === 'side' && sideOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
              {selectedColumn === 'state' && statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={selectedColumnConfig?.type === 'number' ? 'number' : 'text'}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={`Enter ${selectedColumnConfig?.label.toLowerCase()}...`}
              className="w-full p-2 bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--trading-accent))]"
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm border border-[hsl(var(--trading-border))] rounded hover:bg-[hsl(var(--trading-bg))] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFilter}
            disabled={!filterValue.trim()}
            className="px-3 py-2 text-sm bg-[hsl(var(--trading-accent))] text-white rounded hover:bg-[hsl(var(--trading-accent))] hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Filter
          </button>
        </div>
      </div>
    </div>
  );
});

FilterDropdown.displayName = 'FilterDropdown';

// Main FilterBar organism component
export function FilterBar() {
  const {
    searchTerm,
    setSearchTerm,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    expandAll,
    collapseAll
  } = useOrderStore();

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const handleAddFilter = useCallback((filter: FilterConfig) => {
    addFilter(filter);
  }, [addFilter]);

  const handleRemoveFilter = useCallback((column: keyof BaseOrder) => {
    removeFilter(column);
  }, [removeFilter]);

  return (
    <div className="bg-[hsl(var(--trading-surface))] border border-[hsl(var(--trading-border))] rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search orders by symbol, client, trader, account, or ID..."
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded-lg text-sm hover:bg-[hsl(var(--trading-border))] transition-colors"
            >
              <FunnelIcon />
              Add Filter
            </button>
            <FilterDropdown
              isOpen={isFilterDropdownOpen}
              onClose={() => setIsFilterDropdownOpen(false)}
              onAddFilter={handleAddFilter}
            />
          </div>

          {filters.length > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-red-500 hover:bg-red-500 hover:bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Expansion controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-2 text-sm bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded-lg hover:bg-[hsl(var(--trading-border))] transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 text-sm bg-[hsl(var(--trading-bg))] border border-[hsl(var(--trading-border))] rounded-lg hover:bg-[hsl(var(--trading-border))] transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Active filters */}
      {filters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[hsl(var(--trading-border))]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-[hsl(var(--trading-text-secondary))] font-medium">Active Filters:</span>
            {filters.map((filter, index) => (
              <FilterChip
                key={`${String(filter.column)}-${index}`}
                filter={filter}
                onRemove={() => handleRemoveFilter(filter.column)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}