"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReadStatus } from "@/hooks/useReadStatus";
import { toast } from "sonner";
import { File } from "@/generated/prisma/client.js";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FileControls({ file }: { file: File }) {
  const router = useRouter();
  const { userDetails } = useAuth();
  const { readMap, markAsRead, markAsUnread } = useReadStatus();

  const [readLoading, setReadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isRead = readMap[file.id as string] ?? false;

  const toggleRead = async (val: boolean): Promise<void> => {
    setReadLoading(true);
    try {
      if (val) {
        await markAsRead(file.id as string);
        toast.success("Marked as read");
      } else {
        await markAsUnread(file.id as string);
        toast.success("Marked as unread");
      }
    } catch {
      toast.error("Failed to update read status");
    } finally {
      setReadLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);
      const res = await fetch(`/api/file/download?fileId=${file.id}`);
      if (!res.ok) throw new Error("Failed to get signed URL");

      const { url } = await res.json();
      const a = document.createElement("a");
      a.href = url;
      a.download = "file";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      toast.error("Failed to download file");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/file/delete?fileId=${file.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("File deleted successfully");

      if (file.folderId) {
        router.push(
          `/dashboard/course/${file.courseId}/folder/${file.folderId}`
        );
      } else {
        router.push(`/dashboard/course/${file.courseId}`);
      }
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="mt-4 px-4 bg-background flex items-center gap-2 justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="read-toggle"
            checked={isRead}
            onCheckedChange={toggleRead}
            disabled={readLoading}
          />
          <Label htmlFor="read-toggle">
            {isRead ? "Mark as Unread" : "Mark as Read"}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleDownload} disabled={downloadLoading}>
            {downloadLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {downloadLoading ? "Downloading..." : "Download"}
          </Button>

          {userDetails?.role === "admin" && (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setDeleteOpen(true)}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this file? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
