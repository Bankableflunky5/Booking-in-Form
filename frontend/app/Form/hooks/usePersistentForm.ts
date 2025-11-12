"use client";

import { useEffect, useState, useCallback } from "react";
import { emptyFormData, type FormDataShape } from "../types/form";

export function usePersistentForm() {
  const [formData, setFormDataState] = useState<FormDataShape>(emptyFormData);

  // Load once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("formData");
      if (saved) {
        setFormDataState(JSON.parse(saved));
      }
    } catch {
      /* noop: ignore malformed storage */
    }
  }, []);

  const setFormData = useCallback((patch: Partial<FormDataShape>) => {
    setFormDataState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem("formData", JSON.stringify(next));
      } catch {
        /* noop: storage may be unavailable */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setFormDataState(emptyFormData);
    try {
      localStorage.removeItem("formData");
    } catch {
      /* noop */
    }
  }, []);

  return { formData, setFormData, reset };
}
