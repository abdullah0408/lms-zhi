"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";
import { Card, CardContent } from "../ui/card";
import { MoreVertical, Trash2, BookCopy, Book } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Course } from "@/generated/prisma";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";

const CourseCard = ({
  course,
  onDeleteCourseSuccess,
}: {
  course: Course;
  onDeleteCourseSuccess?: (deletedId: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { userDetails } = useAuth();
  const { refreshEnrolledCourses } = useEnrolledCourses();

  const handleOpen = () => {
    router.push(`/dashboard/course/${course.id}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/course/delete?courseId=${course.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Course deleted successfully");
        refreshEnrolledCourses();
        onDeleteCourseSuccess?.(course.id);
      } else {
        throw new Error();
      }
    } catch {
      console.error("Delete failed");
      toast.error("Failed to delete course");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={handleOpen}
            className="hover:shadow-md transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-border/50 relative py-0"
          >
            <CardContent className="flex items-center p-4 space-x-3">
              <div className="flex-shrink-0">
                {isHovered ? <Book className="text-primary" /> : <BookCopy />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {course.title}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(course.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div>
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
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen();
                      }}
                    >
                      <BookCopy className="w-4 h-4 mr-2" />
                      Open
                    </DropdownMenuItem>
                    {userDetails?.role === "admin" && (
                      <DropdownMenuItem
                        className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
                        asChild
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-500"
                          onClick={() => setDeleteOpen(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2 text-red-500 hover:!text-red-600" />
                          Delete
                        </Button>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={handleOpen}>
            <BookCopy className="w-4 h-4 mr-2" />
            Open
          </ContextMenuItem>
          {userDetails?.role === "admin" && (
            <ContextMenuItem
              className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
              asChild
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-500 hover:!text-red-600" />
                Delete
              </Button>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the course "{course.title}"? This
            action cannot be undone.
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
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseCard;
