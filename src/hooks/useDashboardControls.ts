"use client";

import { useContext } from "react";
import { DashboardContext } from "@/contexts/DashboardControlsContext";

/**
 * Custom hook to consume DashboardControlsContext.
 * Throws if used outside <DashboardControlsProvider>.
 */
export const useDashboardControls = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboardControls must be used within a DashboardControlsProvider");
  }
  return ctx;
};

/**
 * Usage Example:
 * ----------------------------------------------
 * import { useDashboardControls } from "@/hooks/useDashboardControls";
 *
 * const Toolbar = () => {
 *   const { searchTerm, setSearchTerm } = useDashboardControls();
 *   return <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />;
 * };
 *
 * Notes:
 * ------
 * - Provides access to `searchTerm`, `sortOption`, `filterType` state and setters.
 * - Requires wrapping component with <DashboardControlsProvider>.
 */
