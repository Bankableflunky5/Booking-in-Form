"use client";

import type { ChangeEvent } from "react";
import type { FormDataShape } from "../types/form";

export default function AppleIdField({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  if (formData.deviceBrand !== "Apple") return null;

  return (
    <div className="flex flex-col space-y-1.5 mt-2">
      <label htmlFor="appleId" className="text-sm font-medium text-gray-700">
        Apple ID (optional)
      </label>
      <input
        id="appleId"
        name="appleId"
        type="email"
        value={formData.appleId}
        onChange={onChange}
        placeholder="e.g. example@icloud.com"
        className="
          p-3 border rounded-lg w-full text-gray-900 placeholder-gray-400
          bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none
          border-gray-300 hover:border-gray-400 transition-all duration-200
        "
        autoComplete="off"
        inputMode="email"
      />
      <p className="text-xs text-gray-600 leading-relaxed">
        Optional. Providing your Apple ID helps with diagnostics (iCloud, Find My, etc.).
        <br />
        <span className="text-gray-500">Do not include your password here.</span>
      </p>
    </div>
  );
}
