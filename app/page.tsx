import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Adjust path if in utils

export default async function Home() {
  // 1. Check if user is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. The Logic
  if (user) {
    redirect("/dashboard"); // Logged in? Go to Dashboard
  } else {
    redirect("/login");     // Not logged in? Go to Login
  }
}