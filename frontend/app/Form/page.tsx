"use client";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { env } from "../lib/env";
import { useJobId } from "./hooks/useJobId";
import { usePersistentForm } from "./hooks/usePersistentForm";
import { useCancelOnUnload } from "./hooks/useCancelOnUnload";
import { useSubmitBooking } from "./hooks/useSubmitBooking";
import { emptyFormData } from "./types/form";
import type { FormDataShape } from "./types/form";

import ErrorBanner from "./components/ErrorBanner";
import FormHeader from "./components/FormHeader";
import JobIdBadge from "./components/JobIdBadge";
import {
  NameRow,
  ContactRow,
  AddressRow,
  HowHeard,
  DeviceType,
  DeviceBrand,
  Issue,
  Password,
} from "./components/Inputs";
import AppleIdField from "./components/AppleIdField";
import DataSaveCheckbox from "./components/DataSaveCheckbox";
import TermsCheckbox from "./components/TermsCheckbox";
import { SubmitButton } from "./components/SubmitButton";

export default function FormPage() {
  const jobID = useJobId();
  const { formData, setFormData, reset } = usePersistentForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { submit, loading, errorMessage, setErrorMessage, goSuccess } = useSubmitBooking(
    env.apiUrl,
    jobID
  );

  useCancelOnUnload(jobID, formSubmitted, env.apiUrl);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement &
        HTMLTextAreaElement &
        HTMLSelectElement;
      const patch: Partial<FormDataShape> = {
        [name]: (type === "checkbox" ? (checked ? 1 : 0) : value) as any,
      };
      setFormData(patch);
    },
    [setFormData]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const ok = await submit(formData);
      if (ok) {
        reset();
        setFormSubmitted(true);
        goSuccess(jobID);
      }
    },
    [submit, formData, reset, goSuccess]
  );

  const handleResetForm = () => {
    reset();
    setFormSubmitted(false);
    setErrorMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <FormHeader />

        <ErrorBanner message={errorMessage} />
        <JobIdBadge jobID={jobID} />

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <NameRow formData={formData} onChange={handleChange} />
          <ContactRow formData={formData} onChange={handleChange} />
          <AddressRow formData={formData} onChange={handleChange} />

          <HowHeard formData={formData} onChange={handleChange} />
          <DeviceType formData={formData} onChange={handleChange} />
          <DeviceBrand formData={formData} onChange={handleChange} />

          <AppleIdField formData={formData} onChange={handleChange} />
          <Issue formData={formData} onChange={handleChange} />
          <Password formData={formData} onChange={handleChange} />

          <DataSaveCheckbox formData={formData} onChange={handleChange as any} />
          <TermsCheckbox formData={formData} onChange={handleChange as any} />

          <SubmitButton loading={loading} />
        </form>

        {/* Optional reset/debug */}
        <div className="mt-6 flex justify-between">
          <button onClick={handleResetForm} className="text-sm text-gray-500 underline">
            Reset form
          </button>
          {/* You may add a cancel button that calls the API if you want manual cancel */}
        </div>
      </div>
    </div>
  );
}
