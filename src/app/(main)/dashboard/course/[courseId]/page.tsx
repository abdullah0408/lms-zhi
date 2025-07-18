import { prisma } from "@/lib/prisma";
import React from "react";
import ItemGrid from "@/components/ItemGrid";
import { ReadStatusProvider } from "@/contexts/ReadStatusContext";

export default async function CourseDashboardPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  //
  // Check if course exists
  //
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold mb-2">Course Not Found</h1>
        <p className="text-gray-600">
          The course you are looking for does not exist.
        </p>
      </div>
    );
  }

  //
  // Fetch root-level folders
  //
  const folders = await prisma.folder.findMany({
    where: {
      courseId,
      parentFolderId: null,
    },
  });

  //
  // Fetch root-level files
  //
  const files = await prisma.file.findMany({
    where: {
      courseId,
      folderId: null,
    },
  });

  return (
    <ReadStatusProvider files={files}>
      <ItemGrid folders={folders} files={files} />
    </ReadStatusProvider>
  );
}
