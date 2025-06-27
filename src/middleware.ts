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

  if (!userId) {
    if (!isPublicRoute(req)) {
      await auth.protect(); // Protect non-public routes
    }
    return;
  }

  // Get user data from Clerk
  const userResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const user = await userResponse.json();
  const role = user?.public_metadata?.role;

  // Redirect logic

  if (role !== "admin" && url.pathname.startsWith("/dashboard")) {
    return Response.redirect(new URL("/e/dashboard", req.url));
  }

  if (
    isPublicRoute(req) &&
    (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))
  ) {
    if (role === "admin") {
      return Response.redirect(new URL("/dashboard", req.url));
    } else {
      return Response.redirect(new URL("/e/dashboard", req.url));
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
