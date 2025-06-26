import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/file/mark-unread
 *
 * Unmarks a file as read for the currently signed-in user.
 * Expects JSON body: { fileId: string }
 *
 * Response:
 *  - 200: Success
 *  - 400: Missing or invalid input
 *  - 401: Unauthorized
 *  - 500: Server error
 */
export async function POST(req: NextRequest) {
  // Retrieve the currently authenticated Clerk user ID.
  const { userId } = await auth();

  // If the user is not signed in, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileId } = await req.json();

  if (!fileId) {
    return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
  }

  try {
    //
    // Delete the read file record
    //
    await prisma.readFile.delete({
      where: {
        userId_fileId: {
          userId,
          fileId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Ignore if already deleted
    if (error.code === "P2025") {
      return NextResponse.json({ success: true });
    }
    // If anything else goes wrong, log and return 500.
    console.error("Error marking file as unread:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
