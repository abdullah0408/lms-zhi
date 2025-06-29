"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Card, CardContent } from "../ui/card";
import {
  MoreVertical,
  File as FileIcon,
  Eye,
  FileText,
  Trash2,
  Download,
  Loader2,
  ArrowUpRight,
  CheckCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { formatDistanceToNow } from "date-fns";
import { File } from "@/generated/prisma";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { usePreviewFile } from "@/hooks/usePreviewFile";
import { getItemUrl, shouldIgnoreClick, handleDelete } from "@/lib/utils";
import { useReadStatus } from "@/hooks/useReadStatus";

const FileCard = ({ file }: { file: File }) => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const { openPreview } = usePreviewFile();
  const { readMap, markAsRead, markAsUnread } = useReadStatus();

  const isRead = readMap[file.id] ?? false;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [readLoading, setReadLoading] = useState(false);

  const toggleRead = async (val: boolean): Promise<void> => {
    setReadLoading(true);
    try {
      if (val) {
        await markAsRead(file.id);
        toast.success("Marked as read");
      } else {
        await markAsUnread(file.id);
        toast.success("Marked as unread");
      }
    } catch (err) {
      console.error("Toggle read error:", err);
      toast.error("Failed to update read status");
    } finally {
      setReadLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch(`/api/file/download?fileId=${file.id}`);
      if (!res.ok) throw new Error("Failed to get signed URL");

      const { url } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = file.title;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteProxy = async () => {
    const success = await handleDelete(file, "File", setDeleting, setDeleteOpen);
    if (success) {
      router.refresh();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldIgnoreClick(e)) return;
    router.push(getItemUrl(file, "File"));
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            className="hover:shadow-md transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-border/50 relative py-0"
          >
            <CardContent className="flex items-center p-4 space-x-3">
              <div className="flex-shrink-0">
                {isHovered ? (
                  <FileText className="text-primary" />
                ) : (
                  <FileIcon />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {file.title}
                  </p>
                  {isRead && (
                    <CheckCheck className="w-4 h-4 text-green-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <span className="truncate">
                    {formatDistanceToNow(new Date(file.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openPreview(file)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
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
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(getItemUrl(file, "File"));
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPreview(file)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {isDownloading ? "Downloading..." : "Download"}
                    </DropdownMenuItem>
                    <div className="flex items-center px-2 py-1.5 space-x-2 text-sm cursor-default select-none">
                      <Switch
                        id={`read-${file.id}`}
                        checked={isRead}
                        onCheckedChange={toggleRead}
                        disabled={readLoading}
                      />
                      <Label htmlFor={`read-${file.id}`}>
                        {isRead ? "Mark as Unread" : "Mark as Read"}
                      </Label>
                    </div>
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
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              router.push(getItemUrl(file, "File"));
            }}
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={() => openPreview(file)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Downloading..." : "Download"}
          </ContextMenuItem>
          <div className="flex items-center px-2 py-1.5 space-x-2 text-sm cursor-default select-none">
            <Switch
              id={`read-context-${file.id}`}
              checked={isRead}
              onCheckedChange={toggleRead}
              disabled={readLoading}
            />
            <Label htmlFor={`read-context-${file.id}`}>
              {isRead ? "Mark as Unread" : "Mark as Read"}
            </Label>
          </div>
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{file.title}"? This action cannot
            be undone.
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
              onClick={handleDeleteProxy}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileCard;
