import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";

/**
 * GET /api/file/download?fileId=...
 *
 * Generates a download URL for a file.
 *
 * Query Params:
 *  - fileId: string (required)
 *
 * Response:
 *  - 200: { url: string }
 *  - 400: Missing or invalid input
 *  - 404: File not found
 *  - 500: Server error
 */

// Initialize the S3-compatible client (e.g., Cloudflare R2)
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const fileId = req.nextUrl.searchParams.get("fileId");

  // Validate input
  if (!fileId) {
    return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
  }

  try {
    // Fetch the file metadata from the database
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Construct a safe filename for the download prompt
    const ext = path.extname(file.filePath);
    const safeTitle = file.title.replace(/[^a-z0-9_\-]/gi, "_");
    const finalFilename = `${safeTitle}${ext}`;

    // Prepare the S3 command to get the object with download headers
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: file.filePath,
      ResponseContentDisposition: `attachment; filename="${finalFilename}"`,
    });

    // Generate a pre-signed URL valid for 60 seconds
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return NextResponse.json({ url: signedUrl });
  } catch (error: any) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
