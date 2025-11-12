"use client";

import TermsCard from "./components/TermsCard";
import { env } from "../lib/env";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <TermsCard businessName={env.businessName} />
    </div>
  );
}
