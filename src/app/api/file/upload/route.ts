import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { FileType } from "@/generated/prisma";
import { auth } from "@clerk/nextjs/server";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
});

/**
 * POST /api/course/file/upload
 *
 * This endpoint allows an authenticated admin user to upload a file to R2 (S3-compatible storage)
 * and save the file metadata (title, type, course association, group folder, etc.) in the database.
 *
 * The request must be a multipart/form-data POST with the following fields:
 *   - file: File (required) — the actual file to be uploaded
 *   - title: string (required) — the display title for the file
 *   - courseId: string (required) — the ID of the associated course
 *   - groupId: string (optional) — the ID of the folder/group (if nested)
 *
 * The file type is inferred from the file extension (e.g., `.zip` → "Zip", others → "File").
 *
 * Response codes:
 *   200 – OK, returns success and created file object
 *   400 – Bad Request (missing required fields)
 *   401 – Unauthorized (no valid Clerk session)
 *   403 – Forbidden (user is not an admin)
 *   500 – Internal Server Error (upload or DB error)
 */
export async function POST(req: NextRequest) {
  // Retrieve the currently authenticated Clerk user ID.
  const { userId } = await auth();

  // If the user is not signed in, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //
  // Get the user from the database to check their role.
  //
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // Ensure the user exists and has admin privileges.
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse form data
  const formData = await req.formData();
  const uploadedFile = formData.get("file") as File;
  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;
  const folderId = formData.get("folderId") as string | null;

  if (!uploadedFile || !title || !courseId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Prepare the file for upload
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = uploadedFile.name.split(".").pop()?.toLowerCase() || "bin";
    const uuidFileName = `${uuidv4()}.${extension}`;
    const type: FileType = extension === "zip" ? "Zip" : "File";

    // Upload file to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: uuidFileName,
      Body: buffer,
      ContentType: uploadedFile.type,
    });

    await R2.send(command);

    //
    // Create the file record in the database
    //
    const savedFile = await prisma.file.create({
      data: {
        title,
        filePath: uuidFileName,
        courseId,
        folderId: folderId || null,
        type,
      },
    });

    return NextResponse.json({ success: true, savedFile });
  } catch (err: any) {
    // If anything goes wrong, log and return 500.
    console.error("Upload Error: ", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}