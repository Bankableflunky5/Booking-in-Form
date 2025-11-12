"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitAnother = useCallback(() => {
    try {
      // Clear saved form data from localStorage
      localStorage.removeItem("formdata");

      // Just to be safe, you can sanity-check if you want:
      if (localStorage.getItem("formdata") !== null) {
        console.warn("formData was not removed from localStorage!");
      }

      // Go back to home/form page
      router.push("/");
    } catch (error) {
      console.error("Error during submission cleanup:", error);
    }
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div
        className={`bg-white shadow-2xl rounded-2xl px-10 py-12 text-center max-w-lg w-full transform transition-opacity duration-700 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl shadow-inner animate-bounce-slow">
            ✅
          </div>
        </div>

        <h1 className="text-4xl font-bold text-blue-700 mb-3">
          Success!
        </h1>
        <p className="text-md text-gray-600 mb-8">
          Your form has been submitted successfully.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleSubmitAnother}
            className="bg-blue-600 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
