"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // lightweight icon

export default function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="
        group mt-10 flex items-center gap-2 px-6 py-3 
        rounded-xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900
        text-white font-semibold shadow-md transition-all duration-300
        hover:shadow-xl hover:-translate-y-0.5 hover:from-gray-600 hover:to-gray-800
        focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
      "
    >
      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </button>
  );
}
