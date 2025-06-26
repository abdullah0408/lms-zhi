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
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UploadFileDialog from "./UploadFileDialog";
import { useState } from "react";
import CreateFolderDialog from "./CreateFolderDialog";

export default function DashboardControlsUI() {
  const {
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
    filterType,
    setFilterType,
  } = useDashboardControls();
  const { userDetails } = useAuth();
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
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

        {userDetails?.role === "admin" && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="text-sm gap-1">
                  <PlusCircle className="w-4 h-4" />
                  Upload
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 p-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setFileDialogOpen(true)}
                >
                  Upload File
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setFolderDialogOpen(true)}
                >
                  Create Folder
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>

            <UploadFileDialog
              open={fileDialogOpen}
              onOpenChange={setFileDialogOpen}
            />

            <CreateFolderDialog
              open={folderDialogOpen}
              onOpenChange={setFolderDialogOpen}
            />
          </>
        )}
      </div>
    </div>
  );
}
