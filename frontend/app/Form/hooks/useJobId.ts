"use client";

import { useSearchParams } from "next/navigation";

export function useJobId(): number | null {
  const params = useSearchParams();
  const jobIDParam = params.get("jobID");
  const jobID = jobIDParam ? Number(jobIDParam) : null;
  return Number.isFinite(jobID as number) ? (jobID as number) : null;
}
