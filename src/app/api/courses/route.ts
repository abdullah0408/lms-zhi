import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/courses
 *
 * This endpoint returns a list of all available courses in the system.
 * Courses are ordered alphabetically by title and include only basic info
 * such as `id`, `title`, and `code` (to keep the response lightweight).
 *
 * Response codes:
 *   200 – OK, returns list of available courses
 *   500 – Internal Server Error (unexpected exception)
 */
export async function GET() {
  try {
    // Fetch all courses, sorted by title, returning only essential fields
    const courses = await prisma.course.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        code: true,
      },
    });

    // Return the course list
    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    // Log the error and return 500 Internal Server Error
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
