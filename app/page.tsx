"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BookmarkBoard from "@/components/BookmarkBoard";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      } else {
        setSession(data.session);
      }

      setChecked(true);
    };

    checkAuth();
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  return <BookmarkBoard />;
}