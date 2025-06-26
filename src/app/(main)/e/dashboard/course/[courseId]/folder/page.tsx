import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  redirect(`/dashboard/course/${courseId}`);
}
