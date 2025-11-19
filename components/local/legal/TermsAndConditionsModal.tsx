"use client";

import * as React from "react";
import { ResponsiveModal } from "@/components/local/custom/ResponsiveModal";
import { useState } from "react";

export function TermsAndConditionsModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title="Terms & Conditions"
      subtitle="The rules for using TradeOff."
      trigger={trigger}
      className="max-w-lg"
    >
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          By using TradeOff, you agree to our terms and conditions. These rules ensure a safe, fair, and enjoyable experience for all users. Please read them carefully before buying or selling.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>All items must be authentic and accurately described.</li>
          <li>Payments are processed securely through our platform.</li>
          <li>Disputes are handled by our support team.</li>
          <li>Abusive behavior or fraud will result in account suspension.</li>
        </ul>
        <p>
          For the full terms, please visit our website or contact support@tradeoff.com.
        </p>
      </div>
    </ResponsiveModal>
  );
}
