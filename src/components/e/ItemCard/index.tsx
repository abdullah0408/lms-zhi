"use client";

import React from "react";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
import ZipCard from "./ZipCard";
import { Folder, Course, File } from "@/generated/prisma";
import CourseCard from "./CourseCard";

interface EnrolledCourse extends Course {
  enrolledAt: Date;
}

const ItemCard = ({ item }: { item: File | Folder | Course | EnrolledCourse }) => {
  switch (item.type) {
    case "Folder":
      return <FolderCard folder={item as Folder} />;
    case "File":
      return <FileCard file={item as File} />;
    case "Zip":
      return <ZipCard file={item as File} />;
    case "Course":
      return <CourseCard course={item as EnrolledCourse} />;
    default:
      return null;
  }
};

export default ItemCard;
