// app/terms/constants/sections.tsx
import React from "react";

type Section = {
  id: string;
  title: string;
  body: React.ReactNode;
};

// Make B a real component that accepts {children}
const B: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <strong>{children}</strong>
);

export function makeTermsSections(businessName: string): Section[] {
  return [
    {
      id: "introduction",
      title: "1. Introduction",
      body: <p>By using our booking form, you agree to comply with our terms and conditions.</p>,
    },
    {
      id: "data-privacy",
      title: "2. Data Privacy",
      body: <p>We collect your data to provide services. We do not share personal data without consent.</p>,
    },
    {
      id: "service-terms",
      title: "3. Service Terms",
      body: (
        <p>
          Any repair services provided are subject to availability and pricing. By signing this document, you give{" "}
          <B>{businessName}</B>{" "}
          permission to assess or repair the device, and you are liable for all agreed payments related to the assessment or repair.
        </p>
      ),
    },
    {
      id: "assessment-fee",
      title: "4. Assessment Fee",
      body: (
        <p>
          Our assessment fee is an upfront, non-refundable or exchangeable payment. We will always inform customers of
          the cost of all repairs before performing them.
        </p>
      ),
    },
    {
      id: "data-responsibility",
      title: "5. Data Responsibility",
      body: (
        <p>
          It is your responsibility to ensure all data is backed up before the repair. <B>{businessName}</B> is not
          liable for any loss of data during the assessment or repair process.
        </p>
      ),
    },
    {
      id: "device-liability",
      title: "6. Device Condition and Liability",
      body: (
        <p>
          You accept that your device may only exhibit certain symptoms of a larger technical issue. <B>{businessName}</B>{" "}
          is not responsible for any further faults occurring during or after the repair or assessment.
        </p>
      ),
    },
    {
      id: "device-collection",
      title: "7. Device Collection",
      body: (
        <p>
          You must be informed by <B>{businessName}</B> that the device is fully repaired and tested before collection. Any
          device collected mid-repair voids all warranties, and the customer is still liable for full payment. Once the
          device is collected, any further unrelated faults will be chargeable.
        </p>
      ),
    },
    {
      id: "warranty-liability",
      title: "8. Warranty and Liability",
      body: (
        <>
          <p>
            You accept that this repair may void any existing warranties. <B>{businessName}</B> is not responsible for items
            left with us for longer than 30 days after notification of collection. We will dispose of such items after this
            period.
          </p>
          <p>
            <B>{businessName}</B> provides the following warranties on repairs: 3 months for new hardware repairs, 1 month for
            reconditioned hardware repairs, and 1 week for software repairs. Games consoles are not covered by the warranty if
            they have been previously repaired or reflowed.
          </p>
          <p>
            <B>{businessName}</B> will not be held responsible for loss or damage to equipment due to fire, theft, accident, or
            any other cause beyond our control.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      title: "9. Changes to Terms",
      body: <p>We may update these terms at any time. Continued use of our services means you accept the updated terms.</p>,
    },
  ];
}

export type TermsSection = ReturnType<typeof makeTermsSections>[number];
