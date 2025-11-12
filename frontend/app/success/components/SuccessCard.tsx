"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type SuccessCardProps = {
  fadeIn: boolean;
  onBack: () => void;
  jobID?: string | number | null;
  title?: string;
  message?: string;
  ctaLabel?: string;
};

export default function SuccessCard({
  fadeIn,
  onBack,
  jobID,
  title = "Success!",
  message = "Your form has been submitted successfully.",
  ctaLabel = "Back to Home",
}: SuccessCardProps) {
  return (
    <motion.article
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: fadeIn ? 1 : 0, y: fadeIn ? 0 : 8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-2xl rounded-2xl px-8 sm:px-10 py-10 text-center max-w-lg w-full"
    >
      {/* Icon */}
      <header className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-700 shadow-inner"
        >
          <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
        </motion.div>
      </header>

      {/* Title + message */}
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-3">{title}</h1>
      <p className="text-base sm:text-lg text-gray-600 mb-6">{message}</p>

      {/* Job Reference ID */}
      {jobID && (
        <p className="text-sm font-medium text-gray-700 mb-8">
          Reference ID:{" "}
          <span className="font-semibold text-blue-700">{jobID}</span>
        </p>
      )}

      {/* CTA */}
      <div className="flex justify-center">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="
            inline-flex items-center justify-center
            bg-blue-700 hover:bg-blue-800
            text-white px-6 sm:px-8 py-3 text-base font-semibold
            rounded-xl shadow-md hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-all duration-300
          "
        >
          {ctaLabel}
        </motion.button>
      </div>
    </motion.article>
  );
}
