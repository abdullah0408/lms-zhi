"use client";

import { useContext } from "react";
import { ReadStatusContext } from "@/contexts/ReadStatusContext";

/**
 * useReadStatus provides access to the user's read/unread status for files.
 * It allows components to:
 *   - Check if a file has been marked as read (via readMap[fileId])
 *   - Mark a file as read or unread (via markAsRead / markAsUnread)
 *
 * Throws an error if used outside <ReadStatusProvider>.
 */
export const useReadStatus = () => {
  const ctx = useContext(ReadStatusContext);

  if (!ctx) {
    throw new Error("useReadStatus must be used within a ReadStatusProvider");
  }

  return ctx;
};

/**
 * Usage Example:
 * -----------------------------------------------------------------
 * 1. Wrap your component tree with <ReadStatusProvider>:
 *
 *    <ReadStatusProvider files={files}>
 *      <ItemGrid folders={folders} files={files} />
 *    </ReadStatusProvider>
 *
 * 2. Use the hook inside any child component:
 *
 *    import { useReadStatus } from "@/hooks/useReadStatus";
 *
 *    const FileCard = ({ file }: { file: File }) => {
 *      const { readMap, markAsRead, markAsUnread } = useReadStatus();
 *      const isRead = readMap[file.id];
 *
 *      const toggleRead = () => {
 *        if (isRead) markAsUnread(file.id);
 *        else markAsRead(file.id);
 *      };
 *
 *      return (
 *        <div
 *          onClick={toggleRead}
 *          className={`p-4 border rounded ${
 *            isRead ? "bg-green-100" : "bg-white"
 *          }`}
 *        >
 *          <h3 className="text-lg font-semibold">{file.title}</h3>
 *          <p className="text-sm text-gray-500">
 *            {isRead ? "Read" : "Unread"}
 *          </p>
 *        </div>
 *      );
 *    };
 *
 * Notes:
 * -----------------------------------------------------------------
 * - This hook is only available inside the ReadStatusProvider.
 * - It tracks read/unread state per file using a `readMap`.
 * - File IDs not present in `readMap` are considered unread.
 * - Updates are persisted to the server via fetch (POST).
 * - This is memory-based state only (not stored across page reloads).
 */
