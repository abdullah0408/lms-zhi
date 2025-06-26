import { prisma } from "@/lib/prisma";
import React from "react";
import ItemGrid from "@/components/e/ItemGrid";

export const dynamic = "force-static";
export const revalidate = 3600; // re-generate every hour

export default async function CourseDashboardPage({
  params,
}: {
  params: Promise<{ courseId: string; folderId: string }>;
}) {
  const { courseId, folderId } = await params;
  //
  // Check if folder exists and belongs to the course
  //
  const folder = await prisma.folder.findUnique({
    where: { id: folderId, courseId },
    select: { id: true },
  });

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h1 className="text-3xl font-bold mb-2">Folder Not Found</h1>
        <p className="text-gray-600">
          The folder you are looking for does not exist or you do not have
          access to it.
        </p>
      </div>
    );
  }

  //
  // Fetch folders in the specified folder
  //
  const folders = await prisma.folder.findMany({
    where: {
      courseId,
      parentFolderId: folderId,
    },
  });

  //
  // Fetch files in the specified folder
  //
  const files = await prisma.file.findMany({
    where: {
      courseId,
      folderId,
    },
  });

  return <ItemGrid folders={folders} files={files} />;
}
