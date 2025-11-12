"use client";

import type { ChangeEvent, ReactNode } from "react";
import type { FormDataShape } from "../types/form";
import {
  howHeardOptions,
  deviceTypeOptions,
  deviceBrandOptions,
} from "../constants/options";

export type InputHandlers = {
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
};

/* ----------------------------- UI Primitives ----------------------------- */

function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-gray-500 leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}

function inputBaseClasses(extra?: string) {
  return [
    "w-full rounded-lg border border-gray-300 bg-white",
    "px-3 py-2.5 text-gray-900 placeholder-gray-400",
    "shadow-sm transition",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "hover:border-gray-400",
    extra || "",
  ].join(" ");
}

/* ------------------------------- Sections -------------------------------- */

export function NameRow({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="First Name" htmlFor="firstName" required>
        <input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          placeholder="e.g. Alex"
          autoComplete="given-name"
          className={inputBaseClasses()}
          required
        />
      </Field>

      <Field label="Last Name" htmlFor="lastName" required>
        <input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          placeholder="e.g. Johnson"
          autoComplete="family-name"
          className={inputBaseClasses()}
          required
        />
      </Field>
    </div>
  );
}

export function ContactRow({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Email Address" htmlFor="email" required>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          className={inputBaseClasses()}
          required
        />
      </Field>

      <Field label="Phone Number" htmlFor="phone" required>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="07xxxxxxxxx"
          autoComplete="tel"
          inputMode="tel"
          className={inputBaseClasses()}
          required
        />
      </Field>
    </div>
  );
}

export function AddressRow({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="House Number" htmlFor="doorNumber" required>
        <input
          id="doorNumber"
          name="doorNumber"
          value={formData.doorNumber}
          onChange={onChange}
          placeholder="e.g. 23A"
          autoComplete="address-line1"
          className={inputBaseClasses()}
          required
        />
      </Field>

      <Field label="Post Code" htmlFor="postCode" required>
        <input
          id="postCode"
          name="postCode"
          value={formData.postCode}
          onChange={onChange}
          placeholder="e.g. SW1A 1AA"
          autoComplete="postal-code"
          className={inputBaseClasses("uppercase tracking-wide")}
          required
        />
      </Field>
    </div>
  );
}

export function HowHeard({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <Field label="How did you hear about us?" htmlFor="howHeard" required>
      <select
        id="howHeard"
        name="howHeard"
        value={formData.howHeard}
        onChange={onChange}
        className={inputBaseClasses()}
        required
      >
        <option value="">Select an option</option>
        {howHeardOptions.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function DeviceType({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <Field label="Device Type" htmlFor="deviceType" required>
      <select
        id="deviceType"
        name="deviceType"
        value={formData.deviceType}
        onChange={onChange}
        className={inputBaseClasses()}
        required
      >
        <option value="">Select device type</option>
        {deviceTypeOptions.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function DeviceBrand({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <Field label="Device Brand" htmlFor="deviceBrand" required>
      <select
        id="deviceBrand"
        name="deviceBrand"
        value={formData.deviceBrand}
        onChange={onChange}
        className={inputBaseClasses()}
        required
      >
        <option value="" disabled>
          Select brand
        </option>
        {deviceBrandOptions.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Issue({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <Field
      label="Describe the Issue"
      htmlFor="issue"
      required
      hint="Include symptoms, when it started, and any error messages you’ve seen."
    >
      <textarea
        id="issue"
        name="issue"
        value={formData.issue}
        onChange={onChange}
        placeholder="e.g. Laptop won’t boot after Windows update; fan runs loudly; error 0x0000007E"
        className={inputBaseClasses("h-28 resize-y")}
        required
      />
    </Field>
  );
}

export function Password({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: InputHandlers["onChange"];
}) {
  return (
    <Field
      label="Device Password (Optional)"
      htmlFor="password"
      hint="Only if needed for diagnostics. You can provide this later in store if you prefer."
    >
      <input
        id="password"
        name="password"
        type="text"
        value={formData.password}
        onChange={onChange}
        placeholder="Enter device password (optional)"
        className={inputBaseClasses()}
        autoComplete="off"
      />
    </Field>
  );
}
