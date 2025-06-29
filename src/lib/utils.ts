import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Course, File, Folder } from "@/generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
