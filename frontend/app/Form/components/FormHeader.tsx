"use client";

import { motion } from "framer-motion";

export default function FormHeader() {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-8"
    >
      <span
        className="
          bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800
          bg-clip-text text-transparent drop-shadow-sm
        "
      >
        Booking In Form
      </span>
    </motion.h2>
  );
}
