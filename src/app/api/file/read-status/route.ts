import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/file/read-status?fileIds=abc,def,ghi
 *
 * Returns an array of file IDs the current user has read from the provided list.
 *
 * Query Parameters:
 * - fileIds: Comma-separated list of file IDs (required)
 *
 * Response:
 * - 200: Success, returns an array of read file IDs
 * - 400: Missing or invalid query
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function GET(req: NextRequest) {
  // Retrieve the currently authenticated Clerk user ID.
  const { userId } = await auth();

  // If the user is not signed in, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fileIdsParam = req.nextUrl.searchParams.get("fileIds");

  if (!fileIdsParam) {
    return NextResponse.json(
      { error: "Missing fileIds query param" },
      { status: 400 }
    );
  }

  const fileIds = fileIdsParam.split(",").filter(Boolean);

  if (fileIds.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    //
    // Fetch read file records for the user
    //
    const readFiles = await prisma.readFile.findMany({
      where: {
        userId,
        fileId: {
          in: fileIds,
        },
      },
      select: {
        fileId: true,
      },
    });

    const readFileIds = readFiles.map((r) => r.fileId);

    return NextResponse.json(readFileIds, { status: 200 });
  } catch (error: any) {
    // If anything goes wrong, log and return 500.
    console.error("Error fetching read file statuses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
