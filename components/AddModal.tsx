"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { X } from "lucide-react";
import { Bookmark } from "./BookmarkList";

type Props = {
  close: () => void;
  onAdd: (bookmark: Bookmark) => void;
};

export default function AddModal({ close, onAdd }: Props) {
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async () => {
    if (!title || !url) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ])
      .select()
      .single<Bookmark>();

    if (!error && data) {
      onAdd(data);
      close();
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="
          relative
          bg-white/70 dark:bg-zinc-900/70
          backdrop-blur-xl
          border border-white/40 dark:border-zinc-800
          rounded-3xl
          p-8
          w-105
          space-y-4
          shadow-2xl
        "
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 text-zinc-500 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Add Bookmark
        </h2>

        <input
          className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {loading ? "Adding..." : "Add Bookmark"}
        </button>
      </motion.div>
    </motion.div>
  );
}