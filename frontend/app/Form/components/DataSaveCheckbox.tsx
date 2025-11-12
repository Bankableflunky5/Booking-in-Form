"use client";

import type { ChangeEvent } from "react";
import type { FormDataShape } from "../types/form";
import CheckboxField from "../../shared/CheckboxField";

export default function DataSaveCheckbox({
  formData,
  onChange,
}: {
  formData: FormDataShape;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <CheckboxField
      id="dataSave"
      name="dataSave"
      checked={formData.dataSave === 1}
      onChange={onChange}
      label="Save my data"
      description={
        <>
          Selecting this option means we’ll prioritize preserving your data during the repair
          process, ensuring that your files are not deleted. If you do not select this option, your
          device may be wiped to expedite repairs by starting with a clean slate. Only choose this
          if keeping your existing files and data is important.
        </>
      }
    />
  );
}
