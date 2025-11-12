"use client";


import { useEffect, useState } from "react";
import type { FormDataShape } from "../types/form";
import { emptyFormData } from "../types/form";


const STORAGE_KEY = "formData";


export function usePersistentForm() {
const [formData, setFormData] = useState<FormDataShape>(emptyFormData);


// Load on mount
useEffect(() => {
try {
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) setFormData(JSON.parse(saved));
} catch {
// ignore
}
}, []);


// Setter with persistence
const update = (next: Partial<FormDataShape>) => {
setFormData((prev) => {
const merged = { ...prev, ...next };
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
} catch {}
return merged;
});
};


const reset = () => {
setFormData(emptyFormData);
try { localStorage.removeItem(STORAGE_KEY); } catch {}
};


return { formData, setFormData: update, reset } as const;
}