"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}` },
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-950">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Continue with Google
      </button>
    </div>
  );
}