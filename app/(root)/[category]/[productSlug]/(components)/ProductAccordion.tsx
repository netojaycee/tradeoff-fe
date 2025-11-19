// components/product/ProductAccordion.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProductAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      <AccordionItem value="size" className=" border-t border-b">
        <AccordionTrigger>Size</AccordionTrigger>
        <AccordionContent>
          <div className="flex gap-2 flex-wrap">
            {["US 7", "US 8", "US 9", "US 10"].map((size) => (
              <button
                key={size}
                className="px-4 py-2 border rounded-md hover:border-gray-400 transition"
              >
                {size}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="description" className="border-t border-b">
        <AccordionTrigger>Description</AccordionTrigger>
        <AccordionContent>
          Premium leather upper with contrast stitching. Rubber lug sole for grip. Padded insole for all-day comfort.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="delivery" className="border-t border-b">
        <AccordionTrigger>Delivery Information</AccordionTrigger>
        <AccordionContent>
          Standard delivery: 3-5 business days. Express: 1-2 business days. Free returns within 14 days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}