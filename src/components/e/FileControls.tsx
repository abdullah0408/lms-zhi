"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { File } from "@/generated/prisma/client.js";

export default function FileControls({ file }: { file: File }) {
  const [downloadLoading, setDownloadLoading] = useState(false);

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

  return (
    <>
      <div className="mt-4 px-4 bg-background flex items-center gap-2 justify-between">
        <div className="flex items-center space-x-2">
          <Button onClick={handleDownload} disabled={downloadLoading}>
            {downloadLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {downloadLoading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
    </>
  );
}
