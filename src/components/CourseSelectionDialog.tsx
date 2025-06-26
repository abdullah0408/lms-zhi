"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Course } from "@/generated/prisma";
import { ScrollArea } from "./ui/scroll-area";
import { BookCopy, Loader2 } from "lucide-react";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CourseSelectionSheet({ open, onOpenChange }: Props) {
  const { refreshEnrolledCourses } = useEnrolledCourses();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previousIds, setPreviousIds] = useState<Set<string>>(new Set());
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function fetchCoursesAndEnrolled() {
      setLoadingCourses(true);
      try {
        const [allRes, enrolledRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/user/enrolled-courses"),
        ]);
        const allCourses = (await allRes.json()) as Course[];
        const enrolled = (await enrolledRes.json()) as Course[];

        setCourses(allCourses);
        const enrolledSet = new Set(enrolled.map((c) => c.id));
        setSelectedIds(new Set(enrolledSet));
        setPreviousIds(new Set(enrolledSet));
      } catch (err) {
        console.error("Failed to load courses or enrolled courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    }

    fetchCoursesAndEnrolled();
  }, [open]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    const toAdd = [...selectedIds].filter((id) => !previousIds.has(id));
    const toRemove = [...previousIds].filter((id) => !selectedIds.has(id));

    try {
      await fetch("/api/user/enrolled-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toAdd, toRemove }),
      });
      onOpenChange(false);
      refreshEnrolledCourses();
    } catch (err) {
      console.error("Failed to save selected courses:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Select Your Courses
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 py-2 divide-y overflow-y-auto">
          {loadingCourses ? (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-2">
              <BookCopy className="h-6 w-6" />
              <p className="text-sm">No courses available.</p>
            </div>
          ) : (
            courses.map((course) => {
              const isSelected = selectedIds.has(course.id);
              return (
                <label
                  key={course.id}
                  className="flex items-center justify-between gap-4 px-2 py-3 cursor-pointer transition hover:bg-accent rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(course.id)}
                    />
                    <span className="w-24 truncate font-mono text-xs text-muted-foreground">
                      {course.code}
                    </span>
                    <span className="truncate text-sm">{course.title}</span>
                  </div>
                </label>
              );
            })
          )}
        </ScrollArea>

        <DialogFooter>
          <div className="flex justify-between items-center w-full px-6 py-4 border-t">
            <div className="text-xs text-muted-foreground">
              {selectedIds.size === 0 ? (
                <span className="flex items-center gap-1">
                  <BookCopy className="h-4 w-4" />
                  Select your first course
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <BookCopy className="h-4 w-4" />
                  {selectedIds.size} course{selectedIds.size > 1 && "s"}{" "}
                  selected
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={save} disabled={saving || loadingCourses}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
