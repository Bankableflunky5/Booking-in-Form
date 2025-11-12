"use client";


import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { clearFormStorageSafely } from "../../shared/storage";



export function useClearAndGoHome() {
const router = useRouter();


const goHome = useCallback(() => {
try {
clearFormStorageSafely();
router.push("/");
} catch (error) {
// Not fatal for UX, but log for debugging
console.error("Error during submission cleanup:", error);
router.push("/");
}
}, [router]);


return goHome;
}