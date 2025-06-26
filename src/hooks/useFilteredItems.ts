"use client";

import { useMemo } from "react";
import { File, Folder, FileType } from "@/generated/prisma";
import { useDashboardControls } from "@/hooks/useDashboardControls";

/**
 * Custom hook to filter and sort combined list of folders and files
 * based on current dashboard search, sort, and filter state.
 *
 * Must be used inside <DashboardControlsProvider>.
 */
export const useFilteredItems = (
  folders: Folder[],
  files: File[]
) => {
  const { searchTerm, sortOption, filterType } = useDashboardControls();

  const items = useMemo(() => {
    const folderItems = folders.map((f) => ({
      id: f.id,
      title: f.title ?? "",
      createdAt: f.createdAt ?? new Date(0),
      type: "Folder" as const,
      raw: f,
    }));

    const fileItems = files.map((f) => ({
      id: f.id,
      title: f.title ?? "",
      createdAt: f.createdAt ?? new Date(0),
      type: f.type === FileType.Zip ? "Zip" : "File",
      raw: f,
    }));

    return [...folderItems, ...fileItems];
  }, [folders, files]);

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (filterType === "folder") return item.type === "Folder";
        if (filterType === "file") return item.type !== "Folder";
        return true;
      })
      .filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const at = new Date(a.createdAt).getTime();
        const bt = new Date(b.createdAt).getTime();

        switch (sortOption) {
          case "dateDesc":
            return bt - at;
          case "dateAsc":
            return at - bt;
          case "alphaAsc":
            return a.title.localeCompare(b.title);
          case "alphaDesc":
            return b.title.localeCompare(a.title);
        }
      });
  }, [items, searchTerm, sortOption, filterType]);

  return filtered;
};

/**
 * Usage Example:
 * ----------------------------------------------
 * import { useFilteredItems } from "@/hooks/useFilteredItems";
 *
 * const Component = ({ folders, files }) => {
 *   const filteredItems = useFilteredItems(folders, files);
 *   return (
 *     <ul>
 *       {filteredItems.map((item) => (
 *         <li key={item.id}>{item.title}</li>
 *       ))}
 *     </ul>
 *   );
 * };
 *
 * Notes:
 * ------
 * - Filters based on searchTerm and filterType.
 * - Sorts based on sortOption.
 * - Uses `useDashboardControls` for state.
 * - Requires wrapping parent with <DashboardControlsProvider>.
 */