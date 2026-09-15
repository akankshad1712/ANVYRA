"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
  loading?: boolean;
}

export default function ConfirmDialog({
  open, title, description,
  confirmLabel = "Confirm", onConfirm, onCancel,
  destructive = false, loading = false
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus the confirm button when the dialog opens; handle Escape key
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => confirmRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(timer); document.removeEventListener("keydown", onKey); };
  }, [open, onCancel]);

  // Focus trap — keep Tab inside the dialog
  const handleTab = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const focusable = e.currentTarget.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#1C0A04]/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            onKeyDown={handleTab}
            className="fixed left-1/2 top-1/2 z-[201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#D6CCBF] bg-[#F7F3EE] p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${destructive ? "bg-red-100" : "bg-amber-100"}`}>
                <AlertTriangle className={`h-5 w-5 ${destructive ? "text-red-600" : "text-amber-600"}`} />
              </div>
              <div>
                <h3 id="confirm-title" className="font-semibold text-[#1C0A04]">{title}</h3>
                <p id="confirm-desc" className="mt-1 text-sm text-[#A0673A]">{description}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-[#D6CCBF] px-5 py-2 text-sm font-medium text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
              >
                Cancel
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
                  destructive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-[#5C2E1A] text-[#F7F3EE] hover:bg-[#3D1A0A]"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
