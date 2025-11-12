"use client";


import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { env } from "../lib/env";
import { api } from "../lib/api";
import type { ReserveJobResponse } from "../lib/types";


export function useBooking() {
const router = useRouter();
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);


const start = useCallback(async () => {
if (!env.apiUrl) {
setError("API URL is not configured");
return;
}


setLoading(true);
setError(null);
try {
// 1) Open the form (DB connection)
await api.post(`${env.apiUrl}/api/open-form`);


// 2) Reserve a Job ID
const { jobID } = await api.post<ReserveJobResponse>(`${env.apiUrl}/api/reserve-job`);


// 3) Navigate
router.push(`/Form?jobID=${jobID}`);
} catch (e: any) {
console.error("Error starting booking:", e);
setError(e?.message || "Something went wrong");
} finally {
setLoading(false);
}
}, [router]);


return { start, loading, error } as const;
}