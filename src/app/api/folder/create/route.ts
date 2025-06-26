import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/folder/create
 *
 * This endpoint creates a new folder (content folder) within a course.
 * The request must be made by an authenticated admin user.
 *
 * Request body should include:
 *   - title: string (required) — name of the folder
 *   - courseId: string (required) — the ID of the course this folder belongs to
 *   - folderId: string (optional) — the ID of the parent folder if this is a nested folder
 *
 * Response codes:
 *   200 – OK, returns the created folder object
 *   400 – Bad Request (missing required fields)
 *   401 – Unauthorized (no valid Clerk session)
 *   403 – Forbidden (user is not an admin)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function POST(req: Request) {
  // Retrieve the currently authenticated Clerk user ID.
  const { userId } = await auth();

  // If the user is not signed in, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensure the user exists and has admin privileges.
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, courseId, folderId } = body;

    if (!title || !courseId) {
      return NextResponse.json(
        { error: "Missing title or courseId" },
        { status: 400 }
      );
    }

    //
    // Create the folder (content folder)
    //
    const folder = await prisma.folder.create({
      data: {
        title,
        courseId,
        parentFolderId: folderId || null,
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    // If anything goes wrong, log and return 500.
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}