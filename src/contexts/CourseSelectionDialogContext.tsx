"use client";

import React, {
  createContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import CourseSelectionDialog from "@/components/CourseSelectionDialog";

type CourseSelectionDialogContextType = {
  open: () => void;
  close: () => void;
};

export const CourseSelectionDialogContext = createContext<
  CourseSelectionDialogContextType | undefined
>(undefined);

/**
 * CourseSelectionDialogProvider controls global state for the course selection dialog.
 * It exposes `open()` and `close()` methods via context so you can trigger the dialog
 * from anywhere in the app without managing `open` state locally.
 */
export const CourseSelectionDialogProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = useCallback((value: boolean) => {
    setIsOpen(value);
  }, []);

  const contextValue: CourseSelectionDialogContextType = {
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return (
    <CourseSelectionDialogContext.Provider value={contextValue}>
      {children}
      <CourseSelectionDialog open={isOpen} onOpenChange={handleOpenChange} />
    </CourseSelectionDialogContext.Provider>
  );
};
