import { ReactNode } from "react";
import { DashboardControlsProvider } from "@/contexts/DashboardControlsContext";
import DashboardControlsUI from "@/components/e/DashboardControlsUI";
import { PreviewFileProvider } from "@/contexts/PreviewFileContext";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardControlsProvider>
      <PreviewFileProvider>
        <div className="container mx-auto max-w-7xl px-2 py-4 select-none">
          <DashboardControlsUI />
          {children}
        </div>
      </PreviewFileProvider>
    </DashboardControlsProvider>
  );
}
