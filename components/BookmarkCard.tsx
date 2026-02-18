"use client";

import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

type Props = {
  bookmark: {
    id: string;
    title: string;
    url: string;
  };
};

export default function BookmarkCard({ bookmark }: Props) {


  const deleteBookmark = async () => {
    await supabase.from("bookmarks").delete().eq("id", bookmark.id);
    toast.success("Bookmark deleted");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-1">
            {bookmark.title}
          </h3>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline text-sm break-all"
          >
            {bookmark.url}
          </a>
        </div>

        <button
          onClick={deleteBookmark}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}