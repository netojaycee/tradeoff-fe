import { CheckoutCredentials } from "@/lib/schema";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatPrice } from "@/lib/utils";

export default function Payment({
  checkoutData,
  paystackLoaded,
  handlePaymentFormSubmit,
}: {
  checkoutData: CheckoutCredentials | null;
  paystackLoaded: boolean;
  handlePaymentFormSubmit: () => void;
}) {
  // Get cart items and calculate totals
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const tax = cartItems.length > 0 ? 1000 : 0;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="space-y-6">
      {/* Payment Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Icon
            icon="material-symbols:info-outline"
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0"
          />
          <div>
            <h4 className="text-sm font-medium text-blue-800">
              Secure Payment with Paystack
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Your payment will be processed securely through Paystack. We never
              store your card details on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Simplified Payment Form - Just triggers Paystack */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Information
        </h2>

        <div className="space-y-4">
          <div className="border border-[#E5E5E5] rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Total Amount</h3>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(total)}</p>
              </div>
              <div className="flex items-center space-x-2 ml-auto md:ml-0">
                <Icon
                  icon="material-symbols:lock-outline"
                  className="w-5 h-5 text-green-600"
                />
                <span className="text-sm text-green-600 font-medium ">
                  Secured by Paystack
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">
                {checkoutData?.firstName} {checkoutData?.lastName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{checkoutData?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery to:</span>
              <span className="font-medium text-right max-w-xs">
                {checkoutData?.streetAddress}, {checkoutData?.lga},{" "}
                {checkoutData?.state}
              </span>
            </div>
          </div>

          <button
            onClick={handlePaymentFormSubmit}
            disabled={!paystackLoaded}
            className="w-full bg-[#38BDF8] hover:bg-[#2abdfc] disabled:bg-gray-400 text-white py-4 text-lg font-medium rounded-lg transition-colors flex items-center justify-center"
          >
            {!paystackLoaded ? (
              <>
                <Icon
                  icon="material-symbols:progress-activity"
                  className="w-5 h-5 animate-spin mr-2"
                />
                Loading Payment System...
              </>
            ) : (
              <>
                <Icon
                  icon="material-symbols:credit-card-outline"
                  className="w-5 h-5 mr-2"
                />
                Pay Securely with Paystack
              </>
            )}
          </button>

          <div className="text-center text-xs text-gray-500">
            Powered by Paystack • PCI DSS Compliant • SSL Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
