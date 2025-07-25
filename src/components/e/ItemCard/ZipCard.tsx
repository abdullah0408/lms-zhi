"use client";

import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../../ui/context-menu";
import { Card, CardContent } from "../../ui/card";
import {
  MoreVertical,
  Download,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { formatDistanceToNow } from "date-fns";
import { File } from "@/generated/prisma";
import { toast } from "sonner";
import Image from "next/image";

const ZipCard = ({ file }: { file: File }) => {

  const [isDownloading, setIsDownloading] = useState(false);

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
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className="hover:shadow-md transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-border/50 relative py-0"
          >
            <CardContent className="flex items-center p-4 space-x-3">
              <div className="flex-shrink-0">
                <Image src="/zip.png" alt="zip icon" width={32} height={32} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {file.title}
                  </p>
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
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
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
                      onClick={handleDownload}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      {isDownloading ? "Downloading..." : "Download"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Downloading..." : "Download"}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default ZipCard;
