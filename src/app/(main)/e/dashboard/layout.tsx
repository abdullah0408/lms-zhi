import { AppSidebar } from "@/components/e/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CourseSelectionDialogProvider } from "@/contexts/CourseSelectionDialogContext";
import { EnrolledCoursesProvider } from "@/contexts/EnrolledCoursesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EnrolledCoursesProvider>
      <CourseSelectionDialogProvider>
        <SidebarProvider>
          <AppSidebar />
          {children}
        </SidebarProvider>
      </CourseSelectionDialogProvider>
    </EnrolledCoursesProvider>
  );
}
