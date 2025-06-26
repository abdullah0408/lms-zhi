import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/file/delete
 *
 * This endpoint deletes a file.
 * It ensures that the user is authenticated and has admin privileges before allowing the deletion.
 * It expects the `fileId` to be passed as a query parameter, e.g.:
 *     /api/file/delete?fileId=abc123
 *
 * Response codes:
 *   200 – OK, file deleted successfully
 *   400 – Bad Request (missing or invalid fileId)
 *   401 – Unauthorized (no valid Clerk session)
 *   404 – Not Found (file does not exist)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function DELETE(req: Request) {
  // Get the authenticated Clerk user ID from the session.
  const { userId } = await auth();

  // If the user is not authenticated, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure the user exists and has admin privileges.
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Extract fileId from the query string (?fileId=xyz)
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  // If fileId is not provided, return 400 Bad Request.
  if (!fileId) {
    return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
  }

  try {
    //
    // Check if the file exists before attempting to delete.
    //
    const existingFile = await prisma.file.findUnique({
      where: { id: fileId },
    });

    // If file not found, return 404 Not Found.
    if (!existingFile) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    //
    // Delete the file.
    //
    await prisma.file.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log and return 500 on error (e.g., DB issue).
    console.error("Error deleting file: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}