"use client";

import React, { createContext, useEffect, useState } from "react";
import { Course } from "@/generated/prisma/client.js";

interface EnrolledCourse extends Course {
  enrolledAt: Date;
}
import { useUser } from "@clerk/nextjs";

interface EnrolledCoursesContextType {
  enrolledCourses: EnrolledCourse[];
  refreshEnrolledCourses: () => void;
  enrolledCourseIsLoading: boolean;
}

export const EnrolledCoursesContext = createContext<
  EnrolledCoursesContextType | undefined
>(undefined);

/**
 * EnrolledCoursesProvider tracks and manages:
 *   - Enrolled courses for the user
 *
 * Data is fetched from corresponding API endpoints. Context consumers can access this data
 * and loading states, and can trigger refresh manually.
 */
export const EnrolledCoursesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // useUser() from @clerk/nextjs gives us:
  //   - isSignedIn: whether Clerk thinks someone is signed in
  //   - isLoaded: whether Clerk has finished loading user data on the client
  const { isSignedIn, isLoaded } = useUser();

  // Enrolled courses
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [enrolledCourseIsLoading, setEnrolledCourseIsLoading] = useState(true);

  /**
   * Fetch courses enrolled by the user.
   */
  const fetchEnrolledCourses = async () => {
    try {
      const res = await fetch("/api/user/enrolled-courses");
      if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
      const data: EnrolledCourse[] = await res.json();
      setEnrolledCourses(data);
    } catch (err) {
      console.error(
        "Error in EnrolledCoursesProvider.fetchEnrolledCourses:",
        err
      );
      setEnrolledCourses([]);
    } finally {
      setEnrolledCourseIsLoading(false);
    }
  };

  /**
   * Refresh function exposed to context consumers.
   */
  const refreshEnrolledCourses = () => {
    setEnrolledCourseIsLoading(true);
    fetchEnrolledCourses();
  };

  /**
   * Fetch enrolled courses when user is authenticated.
   */
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      fetchEnrolledCourses();
    }
  }, [isSignedIn, isLoaded]);

  return (
    <EnrolledCoursesContext.Provider
      value={{
        enrolledCourses,
        refreshEnrolledCourses,
        enrolledCourseIsLoading,
      }}
    >
      {children}
    </EnrolledCoursesContext.Provider>
  );
};
