"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { Folder } from "@/generated/prisma";
import { Loader2 } from "lucide-react";

export default function CreateFolderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const folderId = params.folderId as string | undefined;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsCreating(false);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleCreateFolder = async () => {
    if (!title.trim()) {
      toast.error("Folder title is required");
      return;
    }

    setIsCreating(true);

    const res = await fetch("/api/folder/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, courseId, folderId }),
    });

    setIsCreating(false);

    if (res.ok) {
      const data: Folder = await res.json();
      toast.success(`Folder "${title}" created`);
      router.refresh();

      onOpenChange(false);
    } else {
      const err = await res.text();
      toast.error(`Failed to create folder: ${err || "Unknown error"}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md w-full sm:w-[90%] px-4 sm:px-6 py-6 space-y-5"
        forceMount
      >
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Enter a title and optional description for your new folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-title">Folder Title</Label>
            <Input
              id="folder-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter folder title"
              disabled={isCreating}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleCreateFolder}
              disabled={isCreating || !title.trim()}
              className="flex items-center gap-2"
            >
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
