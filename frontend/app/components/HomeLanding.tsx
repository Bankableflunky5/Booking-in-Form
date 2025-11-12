"use client";

import { Loader2, Wrench, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { env, safeDefaults, getMissingFrontendEnv } from "../lib/env";
import { useBooking } from "../hooks/useBooking";

export default function HomeLanding() {
  // Call hooks/values at top level every render
  const missing = getMissingFrontendEnv();
  const name = env.businessName || safeDefaults.businessName;
  const tagline = env.businessTagline || safeDefaults.businessTagline;
  const { start, loading, error } = useBooking();

  // Render guard OR main UI, but don't early-return before hooks would run
  if (missing.length > 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-50 p-6 text-red-700">
        <section className="w-full max-w-lg rounded-2xl border border-red-300 bg-white p-8 text-center shadow-xl">
          <h1 className="mb-4 text-3xl font-bold">⚠️ Missing Environment Variables</h1>
          <p className="mb-4">The following frontend environment variables are not set:</p>
          <ul className="mb-4 list-inside list-disc text-left">
            {missing.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
          <p className="mb-4">
            Create a <code>.env.local</code> (next to <code>package.json</code>) with:
          </p>
          <pre className="rounded-lg bg-gray-100 p-4 text-left text-sm text-gray-800">
            NEXT_PUBLIC_BUSINESS_NAME=Your Business Name{"\n"}
            NEXT_PUBLIC_BUSINESS_TAGLINE=Your Tagline{"\n"}
            NEXT_PUBLIC_API_URL=http://localhost:5000
          </pre>
          <p className="mt-4 text-gray-600">
            Then restart the dev server (<code>npm run dev</code>).
          </p>
        </section>
      </main>
    );
  }

  // Normal landing
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-lg rounded-2xl bg-white px-8 py-10 text-center shadow-2xl"
        role="region"
        aria-labelledby="landing-title"
      >
        <header className="mb-8">
          <h1
            id="landing-title"
            className="mb-3 text-4xl font-black tracking-tight text-blue-800 sm:text-5xl"
          >
            {name}
          </h1>
          <p className="italic text-gray-500">{tagline}</p>
        </header>

        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">Welcome!</h2>
          <p className="text-lg text-gray-600">
            Need help with your device? Start a new service form below.
          </p>
        </div>

        {error && (
          <div
            className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-left text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Something went wrong</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <motion.button
            onClick={start}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            disabled={loading}
            aria-busy={loading}
            aria-live="polite"
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl px-6 py-3 font-semibold text-white
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-60
              bg-blue-700 hover:bg-blue-800 shadow-md hover:shadow-lg
            "
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Preparing form…</span>
              </>
            ) : (
              <>
                <Wrench className="h-5 w-5" strokeWidth={2.5} />
                <span>Start Booking</span>
              </>
            )}
          </motion.button>
        </div>

        <motion.footer
          className="mt-6 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <span className="sr-only" aria-live="polite">
            {loading ? "Starting booking…" : "Ready"}
          </span>
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </motion.footer>
      </motion.section>
    </main>
  );
}
