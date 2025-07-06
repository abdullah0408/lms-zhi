"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../../ui/context-menu";
import { Card, CardContent } from "../../ui/card";
import {
  MoreVertical,
  BookAlert,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Course } from "@/generated/prisma";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { getItemUrl, shouldIgnoreClick } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { toast } from "sonner";
import Image from "next/image";

interface EnrolledCourse extends Course {
  enrolledAt: Date;
}

const CourseCard = ({ course }: { course: EnrolledCourse }) => {
  const [unenrollOpen, setUnenrollOpen] = useState(false);
  const [targetCourseId, setTargetCourseId] = useState<string | null>(null);
  const [unenrolling, setUnenrolling] = useState(false);

  const router = useRouter();
  const { refreshEnrolledCourses } = useEnrolledCourses();

  useEffect(() => {
    router.prefetch(getItemUrl(course, "Course", true));
  }, [router, course]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldIgnoreClick(e)) return;
    router.push(getItemUrl(course, "Course", true));
  };

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
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            onClick={handleClick}
            className="hover:shadow-md transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-border/50 relative py-0"
          >
            <CardContent className="flex items-center p-4 space-x-3">
              <div className="flex-shrink-0">
                <Image src="/course.png" alt="course icon" width={32} height={32} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {course.title}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(course.enrolledAt), {
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
                        router.push(getItemUrl(course, "Course", true));
                      }}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setTargetCourseId(course.id);
                        setUnenrollOpen(true);
                      }}
                      className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
                    >
                      <BookAlert className="w-4 h-4 mr-2 text-red-500" />
                      <span>Unenroll</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              router.push(getItemUrl(course, "Course", true));
            }}
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Open
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              setTargetCourseId(course.id);
              setUnenrollOpen(true);
            }}
            className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]"
          >
            <BookAlert className="w-4 h-4 mr-2 text-red-500" />
            <span>Unenroll</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Unenroll Dialog */}
      <Dialog open={unenrollOpen} onOpenChange={setUnenrollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Unenrollment</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to unenroll from "{course.title}"? You will
            lose access to this course.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setUnenrollOpen(false)}>
              Cancel
            </Button>
            <Button
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
};

export default CourseCard;
