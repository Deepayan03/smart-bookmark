"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Bookmark } from "./BookmarkList";
import AddModal from "./AddModal";
import ConfirmDeleteModal from "./confirmDeleteModal";
import dynamic from "next/dynamic";

const BookmarkList = dynamic(() => import("./BookmarkList"), {
  ssr: false,
});

type Props = {
  initialData?: Bookmark[];
};

export default function BookmarkBoard({ initialData }: Props) {
const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialData ?? []);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 🔥 REALTIME SUBSCRIPTION
  useEffect(() => {
    let channel: any;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const user = data.session.user;

      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newRow = payload.new as Bookmark | null;
            const oldRow = payload.old as Bookmark | null;

            setBookmarks((prev) => {
              let updated = [...prev];

              if (payload.eventType === "INSERT" && newRow) {
                if (!updated.some((b) => b.id === newRow.id)) {
                  updated = [newRow, ...updated];
                }
              }

              if (payload.eventType === "DELETE" && oldRow) {
                updated = updated.filter((b) => b.id !== oldRow.id);
              }

              if (payload.eventType === "UPDATE" && newRow) {
                updated = updated.map((b) =>
                  b.id === newRow.id ? newRow : b
                );
              }

              return updated;
            });
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // 🔥 ADD HANDLER (Realtime will handle insert)
  const handleAdd = () => {};

  // 🔥 Trigger Confirmation Modal
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  // 🔥 Confirm Actual Delete
  const confirmDelete = async () => {
    if (!deleteId) return;

    await supabase.from("bookmarks").delete().eq("id", deleteId);

    setDeleteId(null);
  };

  return (
    <>
      <div
        className="
          backdrop-blur-xl
          bg-white/60 dark:bg-zinc-900/60
          border border-white/40 dark:border-zinc-800
          rounded-3xl
          shadow-2xl
          p-10
          space-y-8
        "
      >
        <BookmarkList
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          onDelete={handleDelete}
        />
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-8 right-8
          w-16 h-16
          rounded-full
          bg-indigo-600
          text-white
          text-3xl
          shadow-2xl
          hover:scale-110
          active:scale-95
          transition
          flex items-center justify-center
        "
      >
        +
      </button>

      {open && (
        <AddModal close={() => setOpen(false)} onAdd={handleAdd} />
      )}

      {/* 🔥 iOS Glass Delete Confirmation */}
      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}