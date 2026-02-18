import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import BookmarkBoard from "@/components/BookmarkBoard";
import Navbar from "@/components/Navbar";

export default async function Dashboard() {
  const supabase = await createClient();

 const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  redirect("/login");
}

const { data } = await supabase
  .from("bookmarks")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

const bookmarks = data ?? [];



  return (
    <div className="relative min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors">

      {/* Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-150 h-150 bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <Navbar />

      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <BookmarkBoard initialData={bookmarks} />
        </div>
      </div>
    </div>
  );
}