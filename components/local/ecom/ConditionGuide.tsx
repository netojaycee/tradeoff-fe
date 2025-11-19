// components/ui/ConditionGuide.tsx
import { X } from "lucide-react";

type Condition = {
  label: string;
  description: string;
};

const conditions: Condition[] = [
  {
    label: "New",
    description:
      "Practically new — no signs of wear, damage, or wash. Looks fresh out of the box.",
  },
  {
    label: "Almost New",
    description:
      "Lightly worn with small, barely noticeable flaws — like minor fading or tiny scratches. Still in great shape and fully functional.",
  },
  {
    label: "Used",
    description:
      "Used but well-kept. May have small signs of wear such as light stains, mild fading, or minor creases. Nothing that affects its look or use.",
  },
  {
    label: "Worn",
    description:
      "Clearly used with visible wear or slight repairs needed, but still has life in it. Might be from a trendy or in-demand brand that makes it worth the resale.",
  },
];

interface ConditionGuideProps {
  onClose?: () => void;
}

export default function ConditionGuide({ onClose }: ConditionGuideProps) {
  return (
    // Limit height and allow scrolling when content overflows
    <div className="relative max-h-[60vh] md:max-h-[70vh] overflow-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 w-3/4 z-10 border-b bg-white">
        <div className="flex items-center justify-between px-0 py-3">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-0">
            Our Item Condition Guide
          </h2>
        </div>
      </div>

      {/* Intro Text */}
      <div className="p-0 mt-4">
        <p className="text-gray-600 text-base leading-relaxed mb-4">
          Every product listed on our platform is reviewed to ensure it meets our
          quality standards. Whether new or preowned, each item is checked for
          authenticity, cleanliness, and usability before going live.
        </p>

        <div className="mb-8">
          <p className="text-lg text-gray-800 font-medium">
            We group items into the following conditions
          </p>
        </div>

        {/* Conditions List */}
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition.label} className="flex gap-3">
              {/* Pink Badge */}
              <div className="shrink-0">
                <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-sm font-semibold rounded-full">
                  {condition.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {condition.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
