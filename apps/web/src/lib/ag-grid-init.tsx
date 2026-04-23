'use client';

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register AG Grid Community modules only (no license required)
ModuleRegistry.registerModules([
  AllCommunityModule
]);

// This component doesn't render anything, it just ensures modules are registered
export function AGGridInitializer({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
