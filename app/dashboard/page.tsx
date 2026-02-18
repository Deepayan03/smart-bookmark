import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; 
import BookmarkBoard from "@/components/BookmarkBoard";
import Navbar from "@/components/Navbar";

export default async function Dashboard() {
  // 1. Initialize the Server Client
  const supabase = await createClient();

  // 2. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Secure the route
  if (!user) {
    redirect("/login");
  }

  // 4. Fetch the data directly (allowed in Server Components)
  const { data } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const bookmarks = data ?? [];

  return (
    <div className="relative min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors">
      
      {/* Radial Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <Navbar />

      <main className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* 5. Pass the server-fetched data to the Client Component.
            Ensure 'BookmarkBoard' has 'use client' at the top of ITS file.
          */}
          <BookmarkBoard initialData={bookmarks} />
        </div>
      </main>
    </div>
  );
}