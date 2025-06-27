"use client";

import {
  ArrowUpRight,
  Edit,
  Link as LinkIcon,
  MoreHorizontal,
  Loader2,
  PlusCircle,
  BookAlert,
  ExternalLink,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { useCourseSelectionDialog } from "@/hooks/useCourseSelectionDialog";
import Link from "next/link";

export function NavCourses() {
  const { isMobile } = useSidebar();
  const { enrolledCourseIsLoading, enrolledCourses, refreshEnrolledCourses } =
    useEnrolledCourses();
  const { open } = useCourseSelectionDialog();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleCopyLink = async (id: string) => {
    const url = `${baseUrl}/e/dashboard/course/${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleOpenInNewTab = (id: string) => {
    const url = `${baseUrl}/e/dashboard/course/${id}`;
    window.open(url, "_blank");
  };

  const handleUnenroll = async (courseId: string) => {
    try {
      await fetch("/api/user/enrolled-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toAdd: [], toRemove: [courseId] }),
      });
      refreshEnrolledCourses();
    } catch (err) {
      console.error("Failed to unenroll from course:", err);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Selected Courses</SidebarGroupLabel>
      <SidebarMenu>
        {enrolledCourseIsLoading ? (
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading courses...
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            You haven’t selected any courses yet.
          </div>
        ) : (
          enrolledCourses.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <Link href={`/e/dashboard/course/${item.id}`} title={item.title}>
                  <span>📘</span>
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem
                    onClick={() => handleUnenroll(item.id)}
                    className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
                  >
                    <BookAlert className="w-4 h-4 mr-2 text-red-500" />
                    <span>Unenroll from this course</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleCopyLink(item.id)}>
                    <LinkIcon className="text-muted-foreground" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/e/dashboard/course/${item.id}`}
                      className="flex items-center gap-2"
                    >
                      <ArrowUpRight className="text-muted-foreground" />
                      <span>Open</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenInNewTab(item.id)}>
                    <ExternalLink className="text-muted-foreground" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))
        )}

        <SidebarMenuItem>
          <SidebarMenuButton
            className="text-sidebar-foreground/70"
            onClick={open}
          >
            {enrolledCourses.length === 0 ? <Edit /> : <PlusCircle />}
            <span>
              {enrolledCourses.length === 0
                ? "Select your first course"
                : "Manage Courses"}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
