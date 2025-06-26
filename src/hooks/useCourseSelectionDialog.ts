import { useContext } from "react";
import { CourseSelectionDialogContext } from "@/contexts/CourseSelectionDialogContext";

/**
 * Custom hook to consume CourseSelectionDialogContext.
 * Throws if used outside <CourseSelectionDialogProvider>.
 */
export const useCourseSelectionDialog = () => {
  const ctx = useContext(CourseSelectionDialogContext);
  if (!ctx) {
    throw new Error(
      "useCourseSelectionDialog must be used within a CourseSelectionDialogProvider"
    );
  }
  return ctx;
};

/**
 * Usage Example:
 * --------------
 * 1. Wrap your root layout (`app/layout.tsx`) with:
 *
 *    import { CourseSelectionDialogProvider } from "@/components/dialogs/CourseSelectionDialogContext";
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html lang="en">
 *          <body>
 *            <CourseSelectionDialogProvider>
 *              {children}
 *            </CourseSelectionDialogProvider>
 *          </body>
 *        </html>
 *      );
 *    }
 *
 * 2. Trigger in any component:
 *
 *    "use client";
 *    import { useCourseSelectionDialog } from "@/hooks/useCourseSelectionDialog";
 *
 *    const Example = () => {
 *      const { open } = useCourseSelectionDialog();
 *      return <button onClick={open}>Edit Courses</button>;
 *    };
 */
