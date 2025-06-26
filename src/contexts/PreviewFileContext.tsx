"use client";

import React, { createContext, useState, useCallback } from "react";
import { File } from "@/generated/prisma";
import PreviewFileDialog from "@/components/PreviewFileDialog";

interface PreviewFileContextType {
  openPreview: (file: File) => void;
  closePreview: () => void;
}

export const PreviewFileContext = createContext<PreviewFileContextType | undefined>(
  undefined
);

/**
 * PreviewFileProvider renders the FilePreviewDialog once and provides
 * open/close functions to show it from anywhere in the app.
 */
export const PreviewFileProvider = ({ children }: { children: React.ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const openPreview = useCallback((file: File) => {
    setFile(file);
    setOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <PreviewFileContext.Provider value={{ openPreview, closePreview }}>
      {children}
      <PreviewFileDialog file={file} open={open} onOpenChange={setOpen} />
    </PreviewFileContext.Provider>
  );
};
