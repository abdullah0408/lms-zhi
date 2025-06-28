"use client";

import {
  ArrowUpRight,
  Edit,
  Link as LinkIcon,
  MoreHorizontal,
  Trash2,
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
import { useAuth } from "@/hooks/useAuth";
import { useCourseSelectionDialog } from "@/hooks/useCourseSelectionDialog";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

export function NavCourses() {
  const { isMobile } = useSidebar();
  const { enrolledCourseIsLoading, enrolledCourses, refreshEnrolledCourses } =
    useEnrolledCourses();
  const { userDetails } = useAuth();
  const { open } = useCourseSelectionDialog();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const handleCopyLink = async (id: string) => {
    const url = `${baseUrl}/dashboard/course/${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleOpenInNewTab = (id: string) => {
    const url = `${baseUrl}/dashboard/course/${id}`;
    window.open(url, "_blank");
  };
  const [targetCourseId, setTargetCourseId] = useState<string | null>(null);
  const [targetCourseTitle, setTargetCourseTitle] = useState<string>("");
  const [unenrolling, setUnenrolling] = useState(false);
  const [unenrollOpen, setUnenrollOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const confirmUnenroll = async () => {
    if (!targetCourseId) return;

    setUnenrolling(true);
    try {
      await fetch("/api/user/enrolled-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toAdd: [], toRemove: [targetCourseId] }),
      });
      refreshEnrolledCourses();
      toast.success("Unenrolled from course");
    } catch (err) {
      console.error("Failed to unenroll from course:", err);
      toast.error("Failed to unenroll");
    } finally {
      setUnenrolling(false);
      setUnenrollOpen(false);
      setTargetCourseId(null);
      setTargetCourseTitle("");
    }
  };

  const handleDelete = async () => {
    if (!targetCourseId) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `/api/courses/delete?courseId=${targetCourseId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        toast.success("Course deleted successfully");
        refreshEnrolledCourses();
      } else {
        throw new Error();
      }
    } catch {
      console.error("Delete failed");
      toast.error("Failed to delete course");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setTargetCourseId(null);
      setTargetCourseTitle("");
    }
  };

  return (
    <>
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
              You haven’t added any courses yet.
            </div>
          ) : (
            enrolledCourses.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/dashboard/course/${item.id}`}
                    title={item.title}
                  >
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
                    <DropdownMenuItem onClick={() => handleCopyLink(item.id)}>
                      <LinkIcon className="text-muted-foreground" />
                      <span>Copy Link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/course/${item.id}`}
                        className="flex items-center gap-2"
                      >
                        <ArrowUpRight className="text-muted-foreground" />
                        <span>Open</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleOpenInNewTab(item.id)}
                    >
                      <ExternalLink className="text-muted-foreground" />
                      <span>Open in New Tab</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setTargetCourseId(item.id);
                        setTargetCourseTitle(item.title);
                        setUnenrollOpen(true);
                      }}
                      className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
                    >
                      <BookAlert className="text-red-500" />
                      <span>Unenroll</span>
                    </DropdownMenuItem>
                    {userDetails?.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() => {
                          setTargetCourseId(item.id);
                          setTargetCourseTitle(item.title);
                          setDeleteOpen(true);
                        }}
                        className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
                      >
                        <Trash2 className="text-red-500" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    )}
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

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete "{targetCourseTitle}"? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unenroll Dialog */}
      <Dialog open={unenrollOpen} onOpenChange={setUnenrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Unenrollment</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to unenroll from "{targetCourseTitle}"? You
            will lose access to this course.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setUnenrollOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={confirmUnenroll}
              disabled={unenrolling}
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            >
              {unenrolling && <Loader2 className="w-4 h-4 animate-spin" />}
              {unenrolling ? "Unenrolling..." : "Unenroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
