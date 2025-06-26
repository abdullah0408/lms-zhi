"use client";

import React, { createContext, useEffect, useState } from "react";
import { File } from "@/generated/prisma";

interface ReadStatusContextType {
  readMap: Record<string, boolean>;
  markAsRead: (fileId: string) => void;
  markAsUnread: (fileId: string) => void;
}

export const ReadStatusContext = createContext<ReadStatusContextType | undefined>(undefined);

/**
 * ReadStatusProvider manages read/unread state for files.
 * It fetches initial status from the server and provides
 * markAsRead and markAsUnread handlers.
 */
export const ReadStatusProvider = ({
  files,
  children,
}: {
  files: File[];
  children: React.ReactNode;
}) => {
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!files.length) return;

    const fetchReadFiles = async () => {
      try {
        const ids = files.map((f) => f.id).join(",");
        const res = await fetch(`/api/file/read-status?fileIds=${ids}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch read status: ${res.status}`);
        }
        const readIds: string[] = await res.json();
        const mapped = Object.fromEntries(readIds.map((id) => [id, true]));
        setReadMap(mapped);
      } catch (err) {
        console.error("Error in ReadStatusProvider.fetchReadFiles:", err);
      }
    };

    fetchReadFiles();
  }, [files]);

const markAsRead = async (fileId: string): Promise<void> => {
  if (readMap[fileId]) return;

  setReadMap((prev) => ({ ...prev, [fileId]: true }));

  try {
    const res = await fetch("/api/file/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });
    if (!res.ok) throw new Error("Failed to mark as read");
  } catch (err) {
    console.error("Error marking file as read:", err);
  }
};

const markAsUnread = async (fileId: string): Promise<void> => {
  if (!readMap[fileId]) return;

  setReadMap((prev) => {
    const updated = { ...prev };
    delete updated[fileId];
    return updated;
  });

  try {
    const res = await fetch("/api/file/mark-unread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });
    if (!res.ok) throw new Error("Failed to mark as unread");
  } catch (err) {
    console.error("Error marking file as unread:", err);
  }
};


  return (
    <ReadStatusContext.Provider value={{ readMap, markAsRead, markAsUnread }}>
      {children}
    </ReadStatusContext.Provider>
  );
};
