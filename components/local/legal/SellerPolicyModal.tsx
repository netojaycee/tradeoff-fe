"use client";

import * as React from "react";
import { ResponsiveModal } from "@/components/local/custom/ResponsiveModal";
import { useState } from "react";

export function SellerPolicyModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title="Seller Policy"
      subtitle="Guidelines for selling on TradeOff."
      trigger={trigger}
      className="max-w-lg"
    >
      <div className="space-y-4 text-sm text-gray-700">
        <p>
          Welcome to TradeOff! As a seller, you are expected to provide authentic, high-quality fashion items. Please ensure all listings are accurate, and products are in the described condition. Counterfeit or misrepresented items are strictly prohibited.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Only list items you own and are ready to ship.</li>
          <li>Provide clear, honest descriptions and photos.</li>
          <li>Ship sold items within 2 business days.</li>
          <li>Respond promptly to buyer inquiries.</li>
          <li>Respect buyer privacy and data.</li>
        </ul>
        <p>
          TradeOff reserves the right to remove listings or suspend accounts that violate these policies. For more details, see our full seller agreement.
        </p>
      </div>
    </ResponsiveModal>
  );
}
