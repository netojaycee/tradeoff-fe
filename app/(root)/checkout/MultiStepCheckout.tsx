"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { toast } from 'sonner'

import CheckoutForm from './CheckoutForm'
import Confirmation from './Confirmation'
import { useCheckoutMutation } from '@/redux/api'
import { type CheckoutCredentials } from '@/lib/schema'

// Paystack types
declare global {
  interface Window {
    PaystackPop: {
      setup: (options: PaystackOptions) => {
        openIframe: () => void
      }
    }
  }
}

interface PaystackOptions {
  key: string
  email: string
  amount: number
  currency: string
  ref: string
  callback: (response: PaystackResponse) => void
  onClose: () => void
  metadata?: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string
    }>
  }
}

interface PaystackResponse {
  reference: string
  status: string
  transaction: string
  message: string
}

interface OrderDetails {
  orderId: string
  item: string
  size: string
  color: string
  deliveryMethod: string
  deliverTo: string
  paymentMethod: string
  amount: string
}

const steps = [
  { id: 1, name: 'Review Order', icon: 'material-symbols:receipt-long-outline' },
  { id: 2, name: 'Payment', icon: 'material-symbols:payment-outline' },
  { id: 3, name: 'Confirmation', icon: 'material-symbols:check-circle-outline' },
]

export default function MultiStepCheckout() {
  const [currentStep, setCurrentStep] = useState(1)
  const [checkoutData, setCheckoutData] = useState<CheckoutCredentials | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation()

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setPaystackLoaded(true)
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleCheckoutSubmit = async (data: CheckoutCredentials) => {
    try {
      setCheckoutData(data)
      setCurrentStep(2)
      toast.success('Checkout details saved! Proceed to payment.')
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to save checkout details')
    }
  }

  const generatePaystackReference = () => {
    return `tradeoff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handlePaystackPayment = async () => {
    if (!paystackLoaded || !window.PaystackPop) {
      toast.error('Payment system is loading. Please try again.')
      return
    }

    if (!checkoutData) {
      toast.error('Checkout data not found. Please go back and fill the form.')
      return
    }

    try {
      // Create order in backend first
      const checkoutPayload = {
        firstName: checkoutData.firstName,
        lastName: checkoutData.lastName,
        phoneNumber: checkoutData.phoneNumber,
        email: checkoutData.email,
        state: checkoutData.state,
        lga: checkoutData.lga,
        streetAddress: checkoutData.streetAddress,
        paymentMethod: checkoutData.paymentMethod,
        items: [
          {
            name: "LV Remix Boat Shoe Black - 45",
            price: 24000,
            quantity: 1,
          }
        ],
        subtotal: 24000,
        deliveryFee: 2500,
        tax: 1000,
        total: 27500,
      }

      const response = await checkout(checkoutPayload).unwrap()
      
      if (!response.authorization_url) {
        throw new Error('No authorization URL received')
      }

      // Extract reference from Paystack response
      const reference = response.reference || generatePaystackReference()

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here', // Replace with your public key
        email: checkoutData.email,
        amount: 2750000, // Amount in kobo (N27,500.00)
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: `${checkoutData.firstName} ${checkoutData.lastName}`
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: checkoutData.phoneNumber
            },
            {
              display_name: "Delivery Address",
              variable_name: "delivery_address",
              value: `${checkoutData.streetAddress}, ${checkoutData.lga}, ${checkoutData.state}`
            }
          ]
        },
        callback: (response: PaystackResponse) => {
          if (response.status === 'success') {
            // Payment successful
            const successOrderDetails: OrderDetails = {
              orderId: `#LVX-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`,
              item: 'LV Remix Boat Shoe',
              size: '45',
              color: 'Black',
              deliveryMethod: 'Standard (2-5 business days)',
              deliverTo: `${checkoutData.streetAddress}, ${checkoutData.lga}, ${checkoutData.state}`,
              paymentMethod: 'Card Payment',
              amount: 'N27,500.00'
            }
            
            setOrderDetails(successOrderDetails)
            setCurrentStep(3)
            toast.success('Payment successful! Your order has been confirmed.')
          } else {
            toast.error('Payment failed. Please try again.')
          }
        },
        onClose: () => {
          toast.info('Payment cancelled')
        }
      })

      handler.openIframe()

    } catch (error: unknown) {
      console.error('Payment error:', error)
      const errorMessage = error && typeof error === 'object' && 'data' in error && 
        error.data && typeof error.data === 'object' && 'message' in error.data
        ? String(error.data.message)
        : 'Payment failed. Please try again.'
      toast.error(errorMessage)
    }
  }

  const handlePaymentFormSubmit = async () => {
    // Instead of handling card details directly, we use Paystack
    await handlePaystackPayment()
  }

  const handleTrackOrder = () => {
    toast.info('Redirecting to order tracking...')
    // Implement order tracking navigation
  }

  const handleContinueShopping = () => {
    window.location.href = '/'
  }

  const goToStep = (step: number) => {
    if (step < currentStep || (step === 2 && checkoutData)) {
      setCurrentStep(step)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <Icon icon="material-symbols:chevron-right" className="w-4 h-4" />
          <span>LV Remix boat shoe</span>
          <Icon icon="material-symbols:chevron-right" className="w-4 h-4" />
          <span className="text-gray-900">Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            {currentStep === 1 && "Complete your order by providing your payment details"}
            {currentStep === 2 && "Your payment has been confirmed..."}
            {currentStep === 3 && "Order completed successfully!"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      currentStep === step.id
                        ? 'bg-[#38BDF8] text-white'
                        : currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    } ${
                      step.id < currentStep || (step.id === 2 && checkoutData) ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                    }`}
                    disabled={step.id > currentStep && !(step.id === 2 && checkoutData)}
                  >
                    {currentStep > step.id ? (
                      <Icon icon="material-symbols:check" className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </button>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === step.id ? 'text-[#38BDF8]' : 
                    currentStep > step.id ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step Content */}
          {currentStep === 1 && (
            <CheckoutForm
              onSubmit={handleCheckoutSubmit}
              isLoading={isCheckoutLoading}
              defaultValues={checkoutData || undefined}
            />
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Icon icon="material-symbols:info-outline" className="w-5 h-5 text-blue-600 mt-0.5 mr-3 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Secure Payment with Paystack</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your payment will be processed securely through Paystack. We never store your card details on our servers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Simplified Payment Form - Just triggers Paystack */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Total Amount</h3>
                        <p className="text-2xl font-bold text-gray-900">N27,500.00</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon icon="material-symbols:lock-outline" className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Secured by Paystack</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">{checkoutData?.firstName} {checkoutData?.lastName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{checkoutData?.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery to:</span>
                      <span className="font-medium text-right max-w-xs">
                        {checkoutData?.streetAddress}, {checkoutData?.lga}, {checkoutData?.state}
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
                        <Icon icon="material-symbols:progress-activity" className="w-5 h-5 animate-spin mr-2" />
                        Loading Payment System...
                      </>
                    ) : (
                      <>
                        <Icon icon="material-symbols:credit-card-outline" className="w-5 h-5 mr-2" />
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
  )
}