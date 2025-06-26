import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/folder/delete
 *
 * This endpoint deletes a content folder (ContantFolder), including all associated materials.
 * It ensures that the user is authenticated and has admin privileges before allowing the deletion.
 * It expects the `folderId` to be passed as a query parameter, e.g.:
 *     /api/folder/delete?folderId=abc123
 *
 * Response codes:
 *   200 – OK, folder deleted successfully
 *   400 – Bad Request (missing or invalid folderId)
 *   401 – Unauthorized (no valid Clerk session)
 *   404 – Not Found (folder does not exist)
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

  // Extract folderId from the query string (?folderId=xyz)
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get("folderId");

  // If folderId is not provided, return 400 Bad Request.
  if (!folderId) {
    return NextResponse.json({ error: "Missing folderId" }, { status: 400 });
  }

  try {
    //
    // Check if the folder exists before attempting to delete.
    //
    const existingFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    // If folder not found, return 404 Not Found.
    if (!existingFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    //
    // Delete the folder.
    //
    await prisma.folder.delete({
      where: { id: folderId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log and return 500 on error (e.g., DB issue).
    console.error("Error deleting folder: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
