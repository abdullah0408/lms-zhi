import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/user/enrolled-courses
 *
 * This endpoint returns the list of enrolled courses for the currently authenticated Clerk user.
 * It uses Clerk’s `auth()` function to verify the session and extract the user’s Clerk ID.
 *
 * Response codes:
 *   200 – OK, returns the list of enrolled courses
 *   401 – Unauthorized (no valid Clerk session)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function GET(req: Request) {
  // Get the authenticated Clerk user ID from the session.
  const { userId } = await auth();

  // If the user is not authenticated, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    //
    // Query the User row matching the Clerk ID and include their enrolled courses.
    //
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    // Return the enrolled courses with their enrollment date.
    const enrolledCourses = enrollments.map((e) => ({
      ...e.course,
      enrolledAt: e.enrolledAt,
    }));
    return NextResponse.json(enrolledCourses, { status: 200 });
  } catch (error) {
    // If anything goes wrong (e.g., database connectivity), log and return 500.
    console.error("Error fetching enrolledCourses: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/enrolled-courses
 *
 * Updates the currently authenticated user's course enrollments.
 * Only the differences from the previous selection are applied:
 *   - Courses in `toAdd` are added (new enrollments)
 *   - Courses in `toRemove` are deleted (unenrollments)
 *
 * Expected JSON body:
 * {
 *   toAdd: string[],     // list of course IDs to enroll
 *   toRemove: string[]   // list of course IDs to remove
 * }
 *
 * Response codes:
 *   200 – OK, enrollments updated successfully
 *   401 – Unauthorized (no valid Clerk session)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function POST(req: Request) {
  // Get the authenticated Clerk user ID from the session.
  const { userId } = await auth();

  // If the user is not authenticated, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toAdd = [], toRemove = [] } = await req.json();

  try {
    // Validate that toAdd is not empty array.
    if (toAdd.length > 0) {
      //
      // Create new enrollments for the courses in toAdd.
      //
      await prisma.courseEnrollment.createMany({
        data: toAdd.map((courseId: string) => ({ courseId, userId })),
        skipDuplicates: true,
      });
    }
    // Validate that toRemove is not empty array.
    if (toRemove.length > 0) {
      //
      // Remove enrollments for the courses in toRemove.
      //
      await prisma.courseEnrollment.deleteMany({
        where: {
          userId,
          courseId: { in: toRemove },
        },
      });
    }

    return NextResponse.json({ message: "Enrollment updated successfully" });
  } catch (error) {
    console.error("Error updating Enrollment", error);
    return NextResponse.json(
      { error: "Failed to update enrollments" },
      { status: 500 }
    );
  }
}
