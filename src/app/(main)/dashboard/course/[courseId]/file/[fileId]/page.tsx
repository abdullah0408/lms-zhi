import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FileControls from "@/components/FileControls";
import { ReadStatusProvider } from "@/contexts/ReadStatusContext";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string; fileId: string }>;
}) {
  const { courseId, fileId } = await params;

  const currentFile = await prisma.file.findUnique({
    where: { id: fileId },
  });

  if (!currentFile) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl font-bold mb-2">File Not Found</h1>
        <p className="text-gray-600">
          The file you are looking for does not exist or you do not have access
          to it.
        </p>
      </div>
    );
  }

  const { folderId, createdAt, filePath, title } = currentFile;
  const [previous, next] = await Promise.all([
    prisma.file.findFirst({
      where: { courseId, folderId, createdAt: { lt: createdAt } },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    }),
    prisma.file.findFirst({
      where: { courseId, folderId, createdAt: { gt: createdAt } },
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!filePath) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h1 className="text-3xl font-bold mb-2">File Not Available</h1>
        <p className="text-gray-600">This file is not available for preview.</p>
      </div>
    );
  }

  const viewerUrl = `https://docs.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
    `${process.env.NEXT_PUBLIC_R2_Public_URL}/${filePath}`
  )}`;

  return (
    <div className="relative w-full flex flex-col h-[85vh] overflow-x-hidden">
      {/* File Preview */}
      <div className="w-full flex-1 overflow-x-hidden">
        <iframe
          src={viewerUrl}
          className="w-full h-full border-none"
          title={title}
        />
      </div>

      <div className="flex justify-between mt-2 px-4 w-full overflow-x-hidden">
        {previous ? (
          <div className="max-w-xs">
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-1 truncate justify-start"
            >
              <Link href={`/dashboard/course/${courseId}/file/${previous.id}`}>
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="truncate">{previous.title}</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-xs" />
        )}

        {next ? (
          <div className="max-w-xs text-right">
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-1 truncate justify-end"
            >
              <Link href={`/dashboard/course/${courseId}/file/${next.id}`}>
                <span className="truncate">{next.title}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-xs" />
        )}
      </div>

      <ReadStatusProvider files={currentFile ? [currentFile] : []}>
        <FileControls file={currentFile} />
      </ReadStatusProvider>
    </div>
  );
}
