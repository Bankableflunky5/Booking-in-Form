"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME;
  const businessTagline = process.env.NEXT_PUBLIC_BUSINESS_TAGLINE;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const missingFrontendEnv: string[] = [];
  if (!businessName) missingFrontendEnv.push("NEXT_PUBLIC_BUSINESS_NAME");
  if (!businessTagline) missingFrontendEnv.push("NEXT_PUBLIC_BUSINESS_TAGLINE");
  if (!apiUrl) missingFrontendEnv.push("NEXT_PUBLIC_API_URL");

  // If anything important is missing, show a helpful screen
  if (missingFrontendEnv.length > 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-red-50 text-red-700 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg text-center border border-red-300">
          <h1 className="text-3xl font-bold mb-4">⚠️ Missing Environment Variables</h1>
          <p className="mb-4">
            The following frontend environment variables are not set:
          </p>
          <ul className="mb-4 text-left list-disc list-inside">
            {missingFrontendEnv.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
          <p className="mb-4">
            Create a <code>.env.local</code> file in the frontend directory (next to{" "}
            <code>package.json</code>) with values like:
          </p>
          <pre className="bg-gray-100 text-left p-4 rounded-lg text-sm text-gray-800">
            NEXT_PUBLIC_BUSINESS_NAME=Your Business Name
            {"\n"}
            NEXT_PUBLIC_BUSINESS_TAGLINE=Your Tagline
            {"\n"}
            NEXT_PUBLIC_API_URL=http://localhost:5000
          </pre>
          <p className="mt-4 text-gray-600">
            Then restart the dev server (<code>npm run dev</code>).
          </p>
        </div>
      </div>
    );
  }

  // Once env vars are present, use their values (with safe defaults if you want)
  const safeBusinessName = businessName || "Business Name";
  const safeBusinessTagline = businessTagline || "Tech Repair Made Simple.";

  const handleOpenForm = async () => {
    setLoading(true);
    try {
      const openFormResponse = await fetch(`${apiUrl}/api/open-form`, {
        method: "POST",
      });

      if (!openFormResponse.ok) {
        console.error("❌ Error opening database connection");
        setLoading(false);
        return;
      }

      console.log("✅ Form opened successfully, now reserving Job ID...");

      const reserveJobResponse = await fetch(`${apiUrl}/api/reserve-job`, {
        method: "POST",
      });

      if (!reserveJobResponse.ok) {
        console.error("❌ Error reserving Job ID");
        setLoading(false);
        return;
      }

      const { jobID } = await reserveJobResponse.json();
      console.log(`✅ Job ID ${jobID} reserved`);

      router.push(`/Form?jobID=${jobID}`);
    } catch (error) {
      console.error("❌ Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-12 text-center max-w-lg w-full">
        <h1 className="text-5xl font-black text-blue-800 mb-3">
          {safeBusinessName}
        </h1>
        <p className="text-md text-gray-500 mb-8 italic">
          {safeBusinessTagline}
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Need help with your device? Start a new service form below.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleOpenForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Preparing Form...
              </>
            ) : (
              <>🛠️ Start Booking</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
