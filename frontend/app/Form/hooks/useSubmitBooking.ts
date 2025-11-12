"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { FormDataShape } from "../types/form";

export function useSubmitBooking(apiUrl?: string, jobID?: number | null) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submit = async (formData: FormDataShape) => {
    if (loading) return;
    setLoading(true);
    setErrorMessage("");

    if (!formData.termsAccepted) {
      setErrorMessage("You must accept the Terms and Conditions / Privacy Policy.");
      setLoading(false);
      return;
    }

    if (!jobID) {
      setErrorMessage("No Job ID found. Please go back and start the booking again.");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...formData, jobID };
      await axios.post(`${apiUrl}/api/submit`, payload);
      // success handled by page (clear storage + navigate)
      return true;
    } catch (error) {
      console.error("Axios Error:", error?.response ? error.response.data : error?.message);
      setErrorMessage(
        error?.response ? error.response.data?.error : "An error occurred. Check console."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goSuccess = (jobID?: number | null) => {
    const qs = jobID != null ? `?jobID=${jobID}` : "";
    router.push(`/success${qs}`);
  };

  return { submit, loading, errorMessage, setErrorMessage, goSuccess } as const;
}
