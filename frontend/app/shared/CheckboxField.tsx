"use client";

import type { ChangeEvent, ReactNode } from "react";

type CheckboxFieldProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: ReactNode;                // supports text + links
  required?: boolean;
  description?: ReactNode;         // optional helper text under the label
  className?: string;              // optional extra container classes
};

export default function CheckboxField({
  id,
  name,
  checked,
  onChange,
  label,
  required,
  description,
  className = "",
}: CheckboxFieldProps) {
  return (
    <div
      className={`flex flex-col space-y-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          className="
            mt-1 h-5 w-5 rounded-md text-blue-600 border-gray-300
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            transition-all duration-200
          "
        />
        <label
          htmlFor={id}
          className="text-sm sm:text-base font-medium text-gray-800 cursor-pointer select-none"
        >
          {label}
        </label>
      </div>

      {description ? (
        <p className="text-sm text-gray-600 leading-relaxed ml-8">{description}</p>
      ) : null}
    </div>
  );
}
