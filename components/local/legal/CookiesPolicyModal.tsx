"use client";

import * as React from "react";
import { ResponsiveModal } from "@/components/local/custom/ResponsiveModal";
import { useState } from "react";

export function CookiesPolicyModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title="Cookies Policy"
      subtitle="How TradeOff uses cookies."
      trigger={trigger}
      className="max-w-lg"
    >
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          TradeOff uses cookies to personalize your shopping experience, remember your preferences, and analyze site traffic. Cookies help us improve our service and show you relevant products.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Essential cookies are required for site functionality.</li>
          <li>Analytics cookies help us understand usage patterns.</li>
          <li>You can manage cookie preferences in your browser settings.</li>
          <li>By using TradeOff, you consent to our use of cookies.</li>
        </ul>
        <p>
          For more information, see our full cookies policy or contact support@tradeoff.com.
        </p>
      </div>
    </ResponsiveModal>
  );
}
