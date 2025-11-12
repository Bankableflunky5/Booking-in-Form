"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SuccessCard from "./components/SuccessCard";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitAnother = () => {
    try {
      localStorage.removeItem("formdata");
      router.push("/");
    } catch (err) {
      console.error("Error during cleanup:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <SuccessCard
        fadeIn={fadeIn}
        onBack={handleSubmitAnother}
        jobID={searchParams.get("jobID")}  // 👈 this pulls the jobID from URL
      />
    </div>
  );
}
