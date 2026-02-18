"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle entry/exit animations strictly
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Small timeout to allow DOM mount before CSS transition
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open && !visible) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Outer Wrapper: Covers screen to CENTER the modal, but is transparent
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* 2. Backdrop: The dark dimmed background */}
      <div
        onClick={onClose}
        className={`
          absolute inset-0 
          bg-black/30 backdrop-blur-[2px]
          transition-opacity duration-300 ease-out
          ${visible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* 3. The Modal Box: Strictly sized */}
      <div
        className={`
          relative z-10
          w-[320px] max-w-[90vw]
          overflow-hidden
          rounded-2xl
          bg-white/90 dark:bg-zinc-800/90
          backdrop-blur-xl
          shadow-2xl
          ring-1 ring-black/5 dark:ring-white/10
          transform transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275)
          ${
            visible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-90 opacity-0 translate-y-4"
          }
        `}
      >
        <div className="flex flex-col items-center p-6 text-center">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Delete Item
          </h2>
          <p className="mt-2 text-[15px] leading-snug text-zinc-500 dark:text-zinc-400">
            Are you sure? This action cannot be undone.
          </p>
        </div>

        {/* Buttons: Grid with hairline borders */}
        <div className="grid grid-cols-2 border-t border-zinc-900/10 dark:border-white/10 divide-x divide-zinc-900/10 dark:divide-white/10 bg-zinc-50/50 dark:bg-black/20">
          <button
            disabled={loading}
            onClick={onClose}
            className="
              h-12 w-full
              text-[17px] font-medium text-blue-600 dark:text-blue-400
              hover:bg-zinc-100 dark:hover:bg-white/5
              active:bg-zinc-200 dark:active:bg-white/10
              transition-colors
            "
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleConfirm}
            className="
              h-12 w-full
              text-[17px] font-semibold text-red-600 dark:text-red-500
              hover:bg-red-50 dark:hover:bg-red-900/20
              active:bg-red-100 dark:active:bg-red-900/30
              transition-colors
              flex items-center justify-center
            "
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}