"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import CheckoutForm from "./CheckoutForm";
import Confirmation from "./Confirmation";
import { useCreateOrderMutation, useGetOrderByOrderNoQuery } from "@/lib/api";
import { type CheckoutCredentials } from "@/lib/schema";
import { useCartStore } from "@/lib/stores";
import Payment from "./Payment";

const steps = [
  {
    id: 1,
    name: "Review Order",
    icon: "material-symbols:receipt-long-outline",
  },
  { id: 2, name: "Payment", icon: "material-symbols:payment-outline" },
  {
    id: 3,
    name: "Confirmation",
    icon: "material-symbols:check-circle-outline",
  },
];

export default function MultiStepCheckout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutCredentials | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [ordno, setOrdno] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  // Use Zustand store for cart items
  const { items: cartItems } = useCartStore();
  const createOrderMutation = useCreateOrderMutation();

  // Query to fetch order by reference - only runs when reference exists
  const { data: orderData, isLoading: isFetchingOrder } = useGetOrderByOrderNoQuery(
    ordno!,
    { enabled: !!ordno } // Only run when ordno exists
  );

  // Check if returning from Paystack payment
  useEffect(() => {
    const paymentOrdno = searchParams.get('ordno');
    
    if (paymentOrdno) {
      // Set ordno to trigger the query
      setOrdno(paymentOrdno);
    } 
    // else if (paymentOrdno && status === 'cancelled') {
    //   toast.info("Payment cancelled. Please try again.");
    //   // Reset to step 1 for retry
    //   setCurrentStep(1);
    // }
  }, [searchParams]);

  // Handle order data when it arrives from the query
  useEffect(() => {
    if (orderData?.success && orderData.data) {
      setOrderDetails(orderData.data);
      setCurrentStep(3);
      toast.success("Payment successful! Your order has been confirmed.");
    }
  }, [orderData]);

  const handleCheckoutSubmit = async (data: CheckoutCredentials) => {
    try {
      setCheckoutData(data);
      setCurrentStep(2);
      toast.success("Checkout details saved! Proceed to payment.");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to save checkout details");
    }
  };

  const handlePaystackPayment = async () => {
    if (!checkoutData) {
      toast.error("Checkout data not found. Please go back and fill the form.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }

    try {
      // Create order payload matching backend structure
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: checkoutData.firstName,
          lastName: checkoutData.lastName,
          email: checkoutData.email,
          phone: checkoutData.phoneNumber,
          address: checkoutData.streetAddress,
          city: checkoutData.lga, // Using LGA as city
          state: checkoutData.state,
          country: "Nigeria",
        },
        shippingMethod: "standard",
        paymentMethod: "paystack",
      };

      // Create order in backend
      const orderResponse = await createOrderMutation.mutateAsync(orderPayload);

      // Extract payment details
      const { data } = orderResponse;
      
      if (!data?.payment?.authorizationUrl) {
        throw new Error("No authorization URL received from backend");
      }

      // Redirect to authorization URL
      // After payment, user will be redirected back to /checkout?reference=...&status=success
      window.location.href = data.payment.authorizationUrl;
    } catch (error: unknown) {
      console.error("Payment error:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String(error.data.message)
          : "Failed to create order. Please try again.";
      toast.error(errorMessage);
    }
  }

  const handlePaymentFormSubmit = async () => {
    await handlePaystackPayment();
  };

  const handleTrackOrder = () => {
    toast.info("Redirecting to order tracking...");
  };

  const handleContinueShopping = () => {
    window.location.href = "/";
  };

  const goToStep = (step: number) => {
    if (step < currentStep || (step === 2 && checkoutData)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="min-h-screen">
      <div className=" px-4 py-8 md:px-16">
        {/* Page Header */}
        {currentStep !== 3 && (
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Checkout
            </h1>
            <p className="text-gray-600">
              {currentStep === 1 &&
                "Complete your order by providing your payment details"}
              {currentStep === 2 && "Your payment has been confirmed..."}
              {currentStep === 3 && "Order completed successfully!"}
            </p>
          </div>
        )}

        {/* Progress Steps */}
        {currentStep !== 3 && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center flex-nowrap mx-auto">
                    <div className="flex items-center min-w-0">
                      <button
                        onClick={() => goToStep(step.id)}
                        className={`shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-medium transition-colors
                        ${
                          currentStep === step.id
                            ? "bg-[#38BDF8] text-white"
                            : currentStep > step.id
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }
                        ${
                          step.id < currentStep ||
                          (step.id === 2 && checkoutData)
                            ? "cursor-pointer hover:opacity-80"
                            : "cursor-default"
                        }`}
                        disabled={
                          step.id > currentStep &&
                          !(step.id === 2 && checkoutData)
                        }
                      >
                        {currentStep > step.id ? (
                          <Icon
                            icon="material-symbols:check"
                            className="w-4 h-4 sm:w-5 sm:h-5"
                          />
                        ) : (
                          step.id
                        )}
                      </button>

                      <span
                        className={` px-1 truncate text-[9px] sm:text-sm font-medium min-w-0
                        ${
                          currentStep === step.id
                            ? "text-[#38BDF8]"
                            : currentStep > step.id
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                        style={{ maxWidth: "6rem" }} // keeps labels compressed on very small screens
                      >
                        {step.name}
                      </span>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-6 sm:w-14 h-px shrink-0 ${
                        currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="">
          {/* Step Content */}
          {currentStep === 1 && (
            <CheckoutForm
              onSubmit={handleCheckoutSubmit}
              isLoading={createOrderMutation.isPending}
              defaultValues={checkoutData || undefined}
            />
          )}

          {currentStep === 2 && (
            <Payment
              checkoutData={checkoutData}
              isLoading={createOrderMutation.isPending}
              handlePaymentFormSubmit={handlePaymentFormSubmit}
            />
          )}

          {currentStep === 3 && orderDetails && (
            <Confirmation
              orderDetails={orderDetails}
              onTrackOrder={handleTrackOrder}
              onContinueShopping={handleContinueShopping}
            />
          )}
        </div>
      </div>
    </div>
  );
}
