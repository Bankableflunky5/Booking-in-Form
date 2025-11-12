"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

type ErrorBannerProps = {
  message?: string;
  duration?: number | null; // ms; set null to disable auto-dismiss
  dismissible?: boolean;     // show an X button
  onClose?: () => void;      // optional callback when dismissed
};

export default function ErrorBanner({
  message,
  duration = 5000,
  dismissible = true,
  onClose,
}: ErrorBannerProps) {
  const [visible, setVisible] = useState(Boolean(message));

  // Reset visibility & start/clear timer on message changes
  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);

    if (duration == null) return; // persistent mode (no auto-dismiss)

    const t = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          key="error-banner"
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
            flex items-center justify-between gap-3
            rounded-lg border border-red-200 bg-red-50 px-4 py-3
            text-sm sm:text-base text-red-700 shadow-sm
          "
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" strokeWidth={2.3} />
            <p className="font-medium">{message}</p>
          </div>

          {dismissible && (
            <button
              type="button"
              onClick={handleClose}
              className="
                inline-flex items-center justify-center
                rounded-md p-1.5 text-red-600/80 hover:text-red-700
                hover:bg-red-100 focus:outline-none focus:ring-2
                focus:ring-red-500 focus:ring-offset-2 transition
              "
              aria-label="Dismiss error message"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
