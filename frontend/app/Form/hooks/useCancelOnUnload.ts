"use client";

import { useEffect } from "react";

export function useCancelOnUnload(jobID: number | null, formSubmitted: boolean, apiUrl?: string) {
  useEffect(() => {
    if (!jobID || !apiUrl) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
      if (!formSubmitted) {
        try {
          fetch(`${apiUrl}/api/cancel-job`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobID }),
            keepalive: true,
          });
        } catch {
          console.log("Failed to cancel job on unload");
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Do NOT cancel on unmount: user may be navigating to success page
    };
  }, [jobID, formSubmitted, apiUrl]);
}
