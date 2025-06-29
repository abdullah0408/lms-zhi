import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Course, File, Folder } from "@/generated/prisma";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shouldIgnoreClick = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const target = e.target as HTMLElement;

  if (
    target.closest("button") ||
    target.closest("svg") ||
    target.closest('[role="menu"]') ||
    target.closest("[data-interactive]")
  ) {
    return true;
  }

  return false;
};

export const getItemUrl = (
  item: Course | File | Folder,
  type: "Course" | "File" | "Folder",
  isE: boolean = false
): string => {
  const base = isE ? "/e/dashboard" : "/dashboard";

  switch (type) {
    case "Course":
      return `${base}/course/${item.id}`;
    case "File":
      return `${base}/course/${(item as File).courseId}/file/${item.id}`;
    case "Folder":
      return `${base}/course/${(item as Folder).courseId}/folder/${item.id}`;
    default:
      return "";
  }
};

export const handleDelete = async (
  item: Course | File | Folder,
  type: "Course" | "File" | "Folder",
  setDeleting: (deleting: boolean) => void,
  setDeleteOpen: (deleteOpen: boolean) => void
) => {
  setDeleting(true);
  try {
    let url: string;
    switch (type) {
      case "Course":
        url = `/api/courses/delete?courseId=${item.id}`;
        break;
      case "File":
        url = `/api/file/delete?fileId=${item.id}`;
        break;
      case "Folder":
        url = `/api/folder/delete?folderId=${item.id}`;
        break;
    }

    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) throw new Error();

    toast.success(`${type} deleted successfully`);
    return true; // signal success
  } catch {
    toast.error(`Failed to delete ${type}`);
    return false;
  } finally {
    setDeleting(false);
    setDeleteOpen(false);
  }
};
