"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { File } from "@/generated/prisma";
import Link from "next/link";
import { ArrowUpRight, Download, ExternalLink, LayoutPanelTop, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function PreviewFileDialog({
  file,
  open,
  onOpenChange,
}: {
  file: File | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!file) return null;

  const viewerUrl = `https://docs.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_R2_Public_URL}/${file.filePath}`
  )}`;

  const [isDownloading, setIsDownloading] = useState(false);
  const {userDetails} = useAuth()

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

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onOpenChange(false);
      }}
    >
      <DialogContent className="min-w-[99vw] gap-0 sm:min-w-[60vw] h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 pt-4 pb-3 flex items-center justify-between">
          <DialogTitle className="text-base">{file?.title}</DialogTitle>
        </DialogHeader>
        {viewerUrl ? (
          <iframe
            src={viewerUrl}
            className="flex-1 w-full border-t"
            title="File Preview"
          />
        ) : (
          <p className="text-sm text-center py-4">No preview available</p>
        )}

        {file?.filePath && (
          <div className="flex gap-2 justify-end px-4 py-3">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              variant="outline"
              className="cursor-pointer flex items-center gap-2"
            >
              {isDownloading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isDownloading ? (
                "Downloading..."
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </Button>

            {userDetails?.role === "admin" ? (<><Link href={`/dashboard/course/${file.courseId}/file/${file.id}`}>
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <ArrowUpRight className="w-4 h-4" />
                Open
              </Button>
            </Link>
            <Link href={`/e/dashboard/course/${file.courseId}/file/${file.id}`} target="_blank">
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </Button>
            </Link></>) : (<><Link href={`/dashboard/course/${file.courseId}/file/${file.id}`}>
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <ArrowUpRight className="w-4 h-4" />
                Open
              </Button>
            </Link>
            <Link href={`/e/dashboard/course/${file.courseId}/file/${file.id}`} target="_blank">
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </Button>
            </Link></>)}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
