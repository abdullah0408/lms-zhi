import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/clerk/webhooks(.*)",
  "/",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const { userId } = await auth();

  if (isPublicRoute(req)) {
    // If user is signed in and tries to access sign-in or sign-up, redirect them to /e/dashboard
    if (
      userId &&
      (url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up"))
    ) {
      return Response.redirect(new URL("/e/dashboard", req.url));
    }
    return;
  }

  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
