"use client";

import { File, Folder } from "@/generated/prisma";
import { useFilteredItems } from "@/hooks/useFilteredItems";
import ItemCard from "@/components/e/ItemCard";

export default function ItemGrid({
  folders,
  files,
}: {
  folders: Folder[];
  files: File[];
}) {
  const filteredItems = useFilteredItems(folders, files);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredItems.map((item) => (
        <ItemCard
          key={`${item.type}:${item.id}`}
          item={item.raw}
        />
      ))}
    </div>
  );
}
