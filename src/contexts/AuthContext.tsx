"use client";

import React, { createContext, useEffect, useState } from "react";
import { User as PrismaUser } from "@/generated/prisma/client.js";
import { useUser } from "@clerk/nextjs";

interface AuthContextType {
  userDetails: PrismaUser | null;
  isLoading: boolean;
  isSignedIn: boolean | undefined;
  isLoaded: boolean | undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * AuthProvider fetches the Prisma User row corresponding to the currently
 * signed-in Clerk user (looked up by clerkId). During the fetch, it
 * maintains an `isLoading` flag so children can know whether it’s still
 * waiting on Prisma.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, setUserDetails] = useState<PrismaUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useUser() from @clerk/nextjs gives us:
  //   - isSignedIn: whether Clerk thinks someone is signed in
  //   - user: the raw Clerk User object (which has .id, .emailAddresses, etc.)
  //   - isLoaded: whether Clerk has finished loading user data on the client
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    // Track if the component is still mounted to prevent state updates after unmount
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        if (isLoaded && isSignedIn) {
          const res = await fetch("/api/user/user-details");
          if (!res.ok) {
            throw new Error(`Failed to fetch user details: ${res.status}`);
          }
          const prismaUser = await res.json();
          if (isMounted) setUserDetails(prismaUser);
        } else {
          if (isMounted) setUserDetails(null);
        }
      } catch (err) {
        console.error("Error in AuthProvider.fetchDetails:", err);
        if (isMounted) setUserDetails(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetails();

    // When the component unmounts, set isMounted to false
    // so we don't try to update state after it's gone.
    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user, isLoaded]);

  return (
    <AuthContext.Provider
      value={{ userDetails, isLoading, isSignedIn, isLoaded }}
    >
      {children}
    </AuthContext.Provider>
  );
};
