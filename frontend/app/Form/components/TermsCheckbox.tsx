"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import type { FormDataShape } from "../types/form";
import CheckboxField from "../../shared/CheckboxField";

export default function TermsCheckbox({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <CheckboxField
      id="termsAccepted"
      name="termsAccepted"
      checked={formData.termsAccepted === 1}
      onChange={onChange}
      required
      label={
        <>
          I have read and agree to the{" "}
          <Link
            href="/terms"
            className="text-blue-700 font-medium underline underline-offset-2 hover:text-blue-800 focus:text-blue-800 focus:outline-none transition-colors duration-150"
          >
            Terms and Conditions / Privacy Policy
          </Link>
          .
        </>
      }
    />
  );
}
