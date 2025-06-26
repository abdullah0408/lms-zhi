"use client";

import { useContext } from "react";
import { PreviewFileContext } from "@/contexts/PreviewFileContext";

/**
 * Custom hook to consume PreviewFileContext.
 * Throws if used outside <PreviewFileProvider>.
 */
export const usePreviewFile = () => {
  const ctx = useContext(PreviewFileContext);
  if (!ctx) {
    throw new Error("usePreviewFile must be used within a PreviewFileProvider");
  }
  return ctx;
};

/**
 * Usage Example (Next.js App Router):
 * -----------------------------------
 * 1. Wrap your root layout (`app/layout.tsx`) with <PreviewFileProvider>:
 *
 *    import { PreviewFileProvider } from "@/contexts/PreviewFileContext";
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html lang="en">
 *          <body>
 *            <PreviewFileProvider>
 *              {children}
 *            </PreviewFileProvider>
 *          </body>
 *        </html>
 *      );
 *    }
 *
 * 2. Use the hook in any client component:
 *
 *    "use client";
 *    import { usePreviewFile } from "@/hooks/usePreviewFile";
 *    import { File } from "@/generated/prisma";
 *
 *    const FileCard = ({ file }: { file: File }) => {
 *      const { openPreview, closePreview } = usePreviewFile();
 *
 *      return (
 *        <button onClick={() => openPreview(file)}>
 *          Preview {file.title}
 *        </button>
 *      );
 *    };
 *
 * Notes:
 * ------
 * - `openPreview(file)`: Opens the global file preview dialog.
 * - `closePreview()`: Manually closes the preview (optional).
 * - The preview dialog is rendered once globally and shared.
 */
