import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/courses/delete
 *
 * This endpoint deletes a course, including all associated content groups and materials, this is only accessible to admin users.
 * It ensures that the user is authenticated and has admin privileges before allowing the deletion.
 * It expects the `courseId` to be passed as a query parameter, e.g.:
 *     /api/courses/delete?courseId=abc123
 *
 * Response codes:
 *   200 – OK, course deleted successfully
 *   400 – Bad Request (missing or invalid courseId)
 *   403 – Forbidden (user is not an admin)
 *   401 – Unauthorized (no valid Clerk session)
 *   404 – Not Found (course does not exist)
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

  // Extract courseId from the query string (?courseId=xyz)
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  // If courseId is not provided, return 400 Bad Request.
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  try {
    //
    // Check if the course exists before attempting to delete.
    //
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    // If course not found, return 404 Not Found.
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    //
    // Delete the course.
    //
    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log and return 500 on error (e.g., DB issue).
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
