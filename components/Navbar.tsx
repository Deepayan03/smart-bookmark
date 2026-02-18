"use client";

import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-700/40 shadow-xl px-6 py-3 rounded-full flex items-center gap-6">
      <span className="font-semibold">SmartBookmark</span>

      <button
        onClick={() =>
          setTheme(resolvedTheme === "dark" ? "light" : "dark")
        }
        className="hover:scale-110 transition"
      >
        {mounted ? (
          resolvedTheme === "dark" ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )
        ) : (
          <div className="w-[18px] h-[18px]" />
        )}
      </button>

      <button
        onClick={logout}
        className="hover:text-red-500 transition"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}