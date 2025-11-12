"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={!loading ? { scale: 1.015 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      className={`
        group relative flex w-full items-center justify-center gap-2
        rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${
          loading
            ? "bg-blue-500/70 cursor-not-allowed"
            : "bg-blue-700 hover:bg-blue-800 shadow-md hover:shadow-lg"
        }
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-white" />
          <span className="opacity-90">Submitting...</span>
        </>
      ) : (
        <>
          <span>Submit Request</span>
          <div
            className="
              absolute inset-x-0 bottom-0 h-[2px]
              bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
            "
          />
        </>
      )}
    </motion.button>
  );
}
