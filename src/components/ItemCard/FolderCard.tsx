"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";
import { Card, CardContent } from "../ui/card";
import {
  FolderOpen,
  MoreVertical,
  Folder as FolderIcon,
  Trash2,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Folder } from "@/generated/prisma";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const FolderCard = ({ folder }: { folder: Folder }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { userDetails } = useAuth();

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (
      target.closest("button") ||
      target.closest("svg") ||
      target.closest('[role="menu"]') ||
      target.closest("[data-interactive]")
    ) {
      return;
    }

    router.push(`/dashboard/course/${folder.courseId}/folder/${folder.id}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/folder/delete?folderId=${folder.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Folder deleted successfully");
      router.refresh();
    } catch {
      console.error("Delete failed");
      toast.error("Failed to delete Folder");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={handleDoubleClick}
            className="hover:shadow-md transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-border/50 relative py-0"
          >
            <CardContent className="flex items-center p-4 space-x-3">
              <div className="flex-shrink-0">
                {isHovered ? (
                  <FolderOpen className="text-primary" />
                ) : (
                  <FolderIcon />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors select-none">
                    {folder.title}
                  </p>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span className="truncate select-none">
                    {formatDistanceToNow(new Date(folder.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={handleDoubleClick}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Open
                    </DropdownMenuItem>
                    {userDetails?.role === "admin" && (
                      <DropdownMenuItem
                        className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
                        asChild
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-500"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2 text-red-500 hover:!text-red-600" />
                          Delete
                        </Button>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={handleDoubleClick}>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Open
          </ContextMenuItem>

          {userDetails?.role === "admin" && (
            <ContextMenuItem
              className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
              asChild
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-500 hover:!text-red-600" />
                Delete
              </Button>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
      {!!deleteOpen && (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete "{folder.title}"? This action
              cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FolderCard;
