import { useContext } from "react";
import { EnrolledCoursesContext } from "@/contexts/EnrolledCoursesContext";

/**
 * Custom hook to consume EnrolledCoursesContext.
 * Throws if used outside <EnrolledCoursesProvider>.
 */
export const useEnrolledCourses = () => {
  const ctx = useContext(EnrolledCoursesContext);
  if (!ctx) {
    throw new Error(
      "useEnrolledCourses must be used within an EnrolledCoursesProvider"
    );
  }
  return ctx;
};

/**
 * Usage Example (Next.js App Router):
 * -----------------------------------
 * 1. Wrap your root layout (`app/layout.tsx`) or top-level component with <EnrolledCoursesProvider>:
 *
 *    import { EnrolledCoursesProvider } from "@/contexts/EnrolledCoursesContext";
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <EnrolledCoursesProvider>
 *          <html lang="en">
 *            <body>{children}</body>
 *          </html>
 *        </EnrolledCoursesProvider>
 *      );
 *    }
 *
 * 2. Use the hook in any client component:
 *
 *    "use client";
 *    import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
 *
 *    const CourseList = () => {
 *      const { enrolledCourses, enrolledCourseIsLoading, refreshEnrolledCourses } = useEnrolledCourses();
 *
 *      if (enrolledCourseIsLoading) return <p>Loading courses...</p>;
 *      if (enrolledCourses.length === 0) return <p>No courses enrolled yet.</p>;
 *
 *      return (
 *        <ul>
 *          {enrolledCourses.map(course => (
 *            <li key={course.id}>{course.name}</li>
 *          ))}
 *        </ul>
 *      );
 *    };
 *
 * Notes:
 * ------
 * - `enrolledCourses`: List of courses the current user is enrolled in.
 * - `enrolledCourseIsLoading`: Boolean indicating loading state.
 * - `refreshEnrolledCourses`: Call this to manually trigger a refetch.
 */
