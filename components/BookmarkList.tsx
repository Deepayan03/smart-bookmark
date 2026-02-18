"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import React from "react";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
};

type Props = {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  onDelete: (id: string) => void;
};

function SortableItem({
  bookmark,
  onDelete,
}: {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className="
        bg-zinc-100 dark:bg-zinc-800
        border border-zinc-200 dark:border-zinc-700
        rounded-2xl
        p-6
        flex items-center justify-between
        hover:shadow-lg
        transition
      "
    >
      <div className="flex items-center gap-4">
        {/* 🔥 DRAG HANDLE */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-zinc-400 hover:text-zinc-600"
        >
          ☰
        </div>

        <img
          src={`https://www.google.com/s2/favicons?domain=${bookmark.url}`}
          className="w-6 h-6"
          alt=""
        />

        <div>
          <div className="font-medium text-zinc-900 dark:text-white">
            {bookmark.title}
          </div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {bookmark.url}
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(bookmark.id)}
        className="text-red-500 hover:text-red-600 transition"
      >
        Delete
      </button>
    </motion.div>
  );
}

export default function BookmarkList({
  bookmarks,
  setBookmarks,
  onDelete,
}: Props) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = bookmarks.findIndex((b) => b.id === active.id);
    const newIndex = bookmarks.findIndex((b) => b.id === over.id);

    setBookmarks(arrayMove(bookmarks, oldIndex, newIndex));
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={bookmarks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <SortableItem
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}