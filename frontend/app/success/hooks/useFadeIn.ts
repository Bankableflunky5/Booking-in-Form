"use client";

import { useEffect, useState } from "react";

export function useFadeIn(delayMs = 100) {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  return fadeIn;
}
