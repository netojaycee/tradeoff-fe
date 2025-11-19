"use client";

import * as React from "react";
import { ResponsiveModal } from "@/components/local/custom/ResponsiveModal";
import { useState } from "react";

export function PrivacyPolicyModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title="Privacy Policy"
      subtitle="How we protect your data on TradeOff."
      trigger={trigger}
      className="max-w-lg"
    >
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          Your privacy is important to us. TradeOff collects only the information necessary to provide our services, such as your name, contact details, and order history. We never sell your data to third parties.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>We use secure technologies to protect your information.</li>
          <li>Personal data is only shared with trusted partners for order fulfillment.</li>
          <li>You can request deletion of your account and data at any time.</li>
          <li>Cookies are used to enhance your shopping experience.</li>
        </ul>
        <p>
          For more details, please review our full privacy policy or contact support@tradeoff.com.
        </p>
      </div>
    </ResponsiveModal>
  );
}
