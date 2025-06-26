"use client";

import { createContext, useState, ReactNode } from "react";

export type SortOption = "dateDesc" | "dateAsc" | "alphaAsc" | "alphaDesc";
export type FilterType = "all" | "folder" | "file";

export type DashboardContextType = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  sortOption: SortOption;
  setSortOption: (v: SortOption) => void;
  filterType: FilterType;
  setFilterType: (v: FilterType) => void;
};

export const DashboardContext = createContext<DashboardContextType | null>(null);

/**
 * DashboardControlsProvider provides global state for dashboard controls.
 * It manages search term, sort option, and filter type, allowing components
 * to access and update these values without prop drilling.
 */
export function DashboardControlsProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("dateDesc");
  const [filterType, setFilterType] = useState<FilterType>("all");

  return (
    <DashboardContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        sortOption,
        setSortOption,
        filterType,
        setFilterType,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}