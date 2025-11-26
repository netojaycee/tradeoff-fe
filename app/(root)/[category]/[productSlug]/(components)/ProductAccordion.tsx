// components/product/ProductAccordion.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/lib/types";

export function ProductAccordion({product}: {product: Product}) {
  const materials = product.materials || [];
  const shipping = product.shipping || { domestic: 0, international: 0 };
  const shippingMethods = product.shippingMethods || [];

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {/* Size & Fit Section */}
      {product.size && (
        <AccordionItem value="size" className="border-t border-b">
          <AccordionTrigger>Size & Fit</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Size:</span>
                <span className="text-sm text-gray-600">{product.size} ({product.sizeType})</span>
              </div>
              {product.color && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Color:</span>
                  <span className="text-sm text-gray-600">{product.color}</span>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Materials Section */}
      {materials.length > 0 && (
        <AccordionItem value="materials" className="border-t border-b">
          <AccordionTrigger>Materials & Composition</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <span
                  key={material}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                >
                  {material}
                </span>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Description Section */}
      {product.description && (
        <AccordionItem value="description" className="border-t border-b">
          <AccordionTrigger>Full Description</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Shipping Information */}
      <AccordionItem value="delivery" className="border-t border-b">
        <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-sm">
            {shippingMethods.includes('standard') && (
              <div>
                <p className="font-medium text-gray-700">Standard Delivery</p>
                <p className="text-gray-600">₦{shipping.domestic || 1} - Arrives in 3-5 business days</p>
              </div>
            )}
            {shippingMethods.includes('express') && (
              <div>
                <p className="font-medium text-gray-700">Express Delivery</p>
                <p className="text-gray-600">₦{shipping.domestic || 1 * 1.5} - Arrives in 1-2 business days</p>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
              <p className="text-gray-700">✓ Free returns within 14 days</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Seller Information */}
      {product.sellerName && (
        <AccordionItem value="seller" className="border-t border-b">
          <AccordionTrigger>Seller Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-700">{product.sellerName}</p>
              {product.isVerifiedSeller && (
                <p className="text-green-600 font-medium">✓ Verified Seller</p>
              )}
              {product.location && (
                <p className="text-gray-600">
                  📍 {product.location.city}, {product.location.state}, {product.location.country}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}