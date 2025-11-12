"use client";

import Section from "./Section";
import BackButton from "./BackButton";
import { LAST_UPDATED, CONTACT_EMAIL } from "../constants/meta";
import { makeTermsSections } from "../constants/sections";

export default function TermsCard({ businessName }: { businessName?: string | null }) {
  const name = businessName || "Our Business";
  const sections = makeTermsSections(name);

  return (
    <article
      className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10 print:shadow-none print:bg-white"
      aria-labelledby="terms-heading"
    >
      <header>
        <h1 id="terms-heading" className="text-3xl font-semibold text-gray-800">
          Terms &amp; Conditions
        </h1>
        <p className="text-gray-600 mt-2">
          Last Updated: <time dateTime="2025-03">{LAST_UPDATED}</time>
        </p>
      </header>

      {/* Optional in-page TOC */}
      <nav aria-label="Table of contents" className="mt-6">
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <a className="hover:underline" href={`#${s.id}`}>
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections */}
      <div>
        {sections.map((s) => (
          <Section key={s.id} id={s.id} title={s.title}>
            {s.body}
          </Section>
        ))}
      </div>

      <p className="mt-6 text-gray-600">
        For inquiries, contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-600 underline break-all">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <BackButton />
    </article>
  );
}
