// Centralized access to public env vars + validation helpers
export const env = {
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME,
  businessTagline: process.env.NEXT_PUBLIC_BUSINESS_TAGLINE,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};

export function getMissingFrontendEnv(): string[] {
  const missing: string[] = [];
  if (!env.businessName) missing.push("NEXT_PUBLIC_BUSINESS_NAME");
  if (!env.businessTagline) missing.push("NEXT_PUBLIC_BUSINESS_TAGLINE");
  if (!env.apiUrl) missing.push("NEXT_PUBLIC_API_URL");
  return missing;
}

export const safeDefaults = {
  businessName: env.businessName || "Business Name",
  businessTagline: env.businessTagline || "Tech Repair Made Simple.",
};
