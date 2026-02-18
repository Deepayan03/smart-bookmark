"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}`,
      },
    });
  };
  const router = useRouter();

useEffect(() => {
  const check = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      router.replace("/");
    }
  };
  check();
}, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md space-y-6 text-center">
        <h1 className="text-2xl font-bold">
          Smart Bookmark App
        </h1>

        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}