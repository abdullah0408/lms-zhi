"use client";

import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardControls } from "@/hooks/useDashboardControls";
import { SidebarTrigger } from ".././ui/sidebar";
import { Separator } from ".././ui/separator";

export default function DashboardControlsUI() {
  const {
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filterType,
    setFilterType,
  } = useDashboardControls();
  const params = useParams();
  const fileId = params?.fileId;

  if (fileId) {
    return (
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4 pb-4">
        <div className="w-full lg:max-w-sm flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4 pb-4">
      <div className="w-full lg:max-w-sm flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <Input
          className="w-full md:max-w-sm"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={sortOption}
          onValueChange={(v) => setSortOption(v as any)}
        >
          <SelectTrigger className="w-[120px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dateDesc">Newest</SelectItem>
            <SelectItem value="dateAsc">Oldest</SelectItem>
            <SelectItem value="alphaAsc">A → Z</SelectItem>
            <SelectItem value="alphaDesc">Z ← A</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterType}
          onValueChange={(v) => setFilterType(v as any)}
        >
          <SelectTrigger className="w-[100px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="folder">Folders</SelectItem>
            <SelectItem value="file">Files</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
