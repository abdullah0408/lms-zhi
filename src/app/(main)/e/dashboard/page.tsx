"use client";

import React, { useState } from "react";
import ItemCard from "@/components/e/ItemCard";
import { useEnrolledCourses } from "@/hooks/useEnrolledCourses";
import { Edit, Loader2, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCourseSelectionDialog } from "@/hooks/useCourseSelectionDialog";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Top loading bar
const LoadingBar = () => {
  return (
    <>
      <style>{`
        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
      <div className="fixed top-0 left-0 w-full h-0.5 z-50 overflow-hidden bg-transparent">
        <div
          className="h-full w-full bg-primary"
          style={{
            animation: "loadingBar 1.2s ease-in-out infinite",
          }}
        />
      </div>
    </>
  );
};

const Page = () => {
  const { enrolledCourseIsLoading, enrolledCourses, refreshEnrolledCourses } =
    useEnrolledCourses();
  const { open } = useCourseSelectionDialog();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = enrolledCourses?.filter((course) =>
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen w-full relative">
      {enrolledCourseIsLoading && (
        <>
          <LoadingBar />
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        </>
      )}

      <div className="container mx-auto max-w-7xl px-2 py-4 select-none">
        {!enrolledCourseIsLoading && (
          <>
            {enrolledCourses.length > 0 && (
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4 pb-4">
                <div className="w-full lg:max-w-sm flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    <SidebarTrigger />
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4"
                    />
                  </div>
                  <Input
                    className="w-full md:max-w-sm"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCourses?.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
              <Card
                onClick={open}
                className="box-border hover:shadow-md flex items-center justify-center transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-dotted border-border/50 relative py-0"
              >
                <CardContent className="box-border flex items-center justify-center p-4 space-x-3">
                  <div className="text-muted-foreground">
                    {enrolledCourses.length === 0 ? <Edit /> : <PlusCircle />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {!!enrolledCourses.length
                        ? "Manage Courses"
                        : "Select your first course"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
