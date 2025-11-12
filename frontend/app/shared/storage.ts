// Shared storage keys used across pages
export const STORAGE_KEYS = {
formData: "formData", // canonical
legacyFormData: "formdata", // legacy (lowercase) for backward-compat
} as const;


export function clearFormStorageSafely() {
try {
localStorage.removeItem(STORAGE_KEYS.formData);
localStorage.removeItem(STORAGE_KEYS.legacyFormData);
} catch {}
}