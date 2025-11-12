"use client";

export default function JobIdBadge({ jobID }: { jobID: number | null }) {
  if (jobID === null) return null;
  return <div className="text-right text-gray-600 font-bold text-lg">Job ID: {jobID}</div>;
}
