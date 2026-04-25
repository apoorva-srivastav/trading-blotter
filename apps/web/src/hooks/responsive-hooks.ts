'use client';

import { useState, useEffect } from 'react';
import { getCurrentBreakpoint, isMobile, isTablet, isDesktop } from '@/lib/utils';

// Hook to track current breakpoint
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<string>('sm');

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    // Set initial breakpoint
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

// Hook to track if device is mobile
export function useIsMobile() {
  const [mobile, setMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mobile;
}

// Hook to track if device is tablet
export function useIsTablet() {
  const [tablet, setTablet] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setTablet(isTablet());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return tablet;
}

// Hook to track if device is desktop
export function useIsDesktop() {
  const [desktop, setDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setDesktop(isDesktop());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return desktop;
}

// Hook to get window dimensions
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Hook for responsive values based on breakpoint
export function useResponsiveValue<T>(values: {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
  '3xl'?: T;
  '4xl'?: T;
}) {
  const breakpoint = useBreakpoint();
  
  // Return the most specific value for current breakpoint
  if (breakpoint === '4xl' && values['4xl'] !== undefined) return values['4xl'];
  if (breakpoint === '3xl' && values['3xl'] !== undefined) return values['3xl'];
  if (breakpoint === '2xl' && values['2xl'] !== undefined) return values['2xl'];
  if (breakpoint === 'xl' && values.xl !== undefined) return values.xl;
  if (breakpoint === 'lg' && values.lg !== undefined) return values.lg;
  if (breakpoint === 'md' && values.md !== undefined) return values.md;
  if (breakpoint === 'sm' && values.sm !== undefined) return values.sm;
  if (breakpoint === 'xs' && values.xs !== undefined) return values.xs;
  
  return values.base;
}

// Hook for responsive grid columns
export function useResponsiveColumns(config: {
  base?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}) {
  return useResponsiveValue(config);
}

// Hook for responsive text size
export function useResponsiveTextSize(config: {
  base?: string;
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}) {
  return useResponsiveValue(config);
}

// Hook to detect if user prefers reduced motion
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Hook to detect if user prefers dark mode
export function usePrefersDarkMode() {
  const [prefersDarkMode, setPrefersDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDarkMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDarkMode(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersDarkMode;
}

// Hook for responsive table column visibility
export function useResponsiveTableColumns<T extends string>(columns: T[]) {
  const isMobileDevice = useIsMobile();
  const isTabletDevice = useIsTablet();
  
  // Define which columns to hide on different devices
  const getVisibleColumns = () => {
    if (isMobileDevice) {
      // On mobile, show only essential columns
      return columns.filter(col => 
        !['created', 'trader', 'algorithm', 'account', 'venue'].includes(col)
      );
    }
    
    if (isTabletDevice) {
      // On tablet, hide some less important columns
      return columns.filter(col => 
        !['algorithm', 'venue'].includes(col)
      );
    }
    
    // On desktop, show all columns
    return columns;
  };
  
  return getVisibleColumns();
}
